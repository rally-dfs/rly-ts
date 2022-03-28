
import { FC, useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Button, Grid, TextField,  Box, InputLabel } from '@mui/material';
import Image from 'next/image';


const CreateNft: FC = () => {

   
    type nftMetaValues = {
        nftName: string,
        nftDescription: string,
        nftSymbol:String
    }

    const defaultNftMetaValues = {
        nftName: "",
        nftDescription: "",
        nftSymbol: ""
    } as nftMetaValues;

    const [formValues, setFormValues] = useState(defaultNftMetaValues)
    const [selectedFile, setSelectedFile] = useState()
    const [ratio, setRatio] = useState(16/9) // default to 16:9
    const [preview, setPreview] = useState<string | null>(null)

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


  const onSelectFile = (e:any) => {
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
        const { nftName, nftDescription } = formValues;
        console.log(nftName, nftDescription) 

        //upload image 
        // loader
        //upload metadata
        //loader
        //create nft
        //loader
        //success
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
                    <Button component="span">Upload Image</Button>
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
        </Box >
    );


}

export default CreateNft