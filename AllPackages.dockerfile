FROM node:lts

WORKDIR /app

#Copy top level package dependency file
COPY lerna.json ./
COPY package.json ./
COPY package-lock.json ./

COPY packages packages

#Remove all files that are not package.json files. This is a hack to allow for dependency installation to be cached
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 10 -print | xargs rm -rf

# Second Build Phase that makes use of only package.json files from above
FROM node:lts

WORKDIR /app

RUN npm install -g lerna

COPY --from=0 /app .

# Install all deps for all packages
RUN lerna bootstrap

# Copy over all the source code
COPY . .

ENTRYPOINT ["lerna"]