
import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Button, Grid, TextField, Box, InputLabel, Typography, Link, Stack } from '@mui/material';
import { actions, Wallet } from "@metaplex/js"
import Image from 'next/image';
import { EXPLORER_ROOT, NETWORK } from "../config";


const { mintNFT } = actions;


const CreateNft: FC = () => {

    const { connection } = useConnection();
    const wallet = useWallet() as Wallet;

    type metadata = {
        name: string,
        description: string,
        image: string,
        symbol: string,
        properties: any,
    }

    type nftValues = {
        nftName: string,
        nftDescription: string,
        nftSymbol: string
    }

    type mintReturnType = {
        txId: string,
        mint: string
    }

    const defaultNftMetaValues = {
        nftName: "",
        nftDescription: "",
        nftSymbol: ""
    } as nftValues;

    const [formValues, setFormValues] = useState(defaultNftMetaValues)
    const [selectedFile, setSelectedFile] = useState()
    const [ratio, setRatio] = useState(16 / 9) // default to 16:9
    const [preview, setPreview] = useState<string | null>(null)
    const [mintReturn, setMintReturn] = useState<mintReturnType | null>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile])


    const onSelectFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const { nftName, nftDescription, nftSymbol } = formValues;


        if (!wallet.publicKey) {
            console.log("wallet not active")
        } else {


            // upload image to arweave

            const imgBody = new FormData();
            selectedFile && imgBody.append("image", selectedFile);

            const { imageUri } = await fetch('/api/image', {
                method: 'POST',
                body: imgBody
            }).then((res: Response) => res.json())

            console.log("image uploaded")

            // add image to metadata obj and upload metadata obj

            const creators = [];
            creators.push({
                address: wallet.publicKey,
                share: 100
            })

            const metadata = {
                name: nftName,
                description: nftDescription,
                symbol: nftSymbol,
                image: imageUri,
                properties: {
                    creators
                }
            } as metadata

            const { metadataUri } = await fetch('/api/metadata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metadata)
            }).then((res: Response) => res.json())

            console.log("metadata uploaded")
            console.log(metadataUri)


            const { txId, mint } = await mintNFT({ connection, wallet, uri: metadataUri, maxSupply: 1 })

            console.log(txId);
            console.log(mint);

            await connection.confirmTransaction(txId);

            return setMintReturn({ txId, mint: mint.toBase58() })

            //upload image 
            // loader
            //upload metadata
            //loader
            //create nft
            //loader
            //success
        }
    };


    return (
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 6 }}>
            <Grid container spacing={3} maxWidth="sm">
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="nftName"
                        name="nftName"
                        label="NFT Name"
                        value={formValues.nftName}
                        onChange={handleInputChange}
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="nftSymbol"
                        name="nftSymbol"
                        label="NFT Symbol"
                        value={formValues.nftSymbol}
                        onChange={handleInputChange}
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TextField
                        required
                        id="nftDescription"
                        name="nftDescription"
                        label="NFT Description"
                        fullWidth
                        variant="standard"
                        value={formValues.nftDescription}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    {preview &&
                        <Image alt=""
                            src={preview}
                            width={500}
                            height={500 / ratio}
                            layout="fixed" // you can use "responsive", "fill" or the default "intrinsic"
                            onLoadingComplete={({ naturalWidth, naturalHeight }) =>
                                setRatio(naturalWidth / naturalHeight)
                            }

                        />
                    }
                    <InputLabel id="upload-image">
                        <Button component="span">Select Image</Button>
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="upload-image"
                            multiple
                            type="file"
                            onChange={onSelectFile}
                        />
                    </InputLabel>
                </Grid>
            </Grid>
            <Button variant="contained" color="primary" type="submit" sx={{ mt: 3, mb: 2 }}>
                Create Nft
            </Button>
            {
                mintReturn && (

                    <Stack spacing={1}>
                        <Typography variant="body1" color="text.secondary">{`nft successfully created! `}<Link href={`${EXPLORER_ROOT}/tx/${mintReturn.txId}?cluster=${NETWORK}`} target="_blank">(view transaction)</Link></Typography>
                        <Typography variant="body1" color="text.secondary">token mint: <Link href={`${EXPLORER_ROOT}/address/${mintReturn.mint}?cluster=${NETWORK}`} target="_blank">{`${mintReturn.mint}`}</Link></Typography>
                    </Stack>
                )
            }
        </Box >
    );


}

export default CreateNft