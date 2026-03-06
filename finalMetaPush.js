const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { createSignerFromKeypair, signerIdentity } = require('@metaplex-foundation/umi');
const { createV1, TokenStandard } = require('@metaplex-foundation/mpl-token-metadata');
const { publicKey } = require('@metaplex-foundation/umi');
const fs = require('fs');

// GITHUB GIST URL YAHAN PASTE KARO:
const METADATA_URI = 'https://raw.githubusercontent.com/jai-m5/metadata.json/main/rugwifhat-metadata.json';

async function main() {
    if (METADATA_URI === 'YOUR_GITHUB_GIST_RAW_URL_HERE') {
        console.log('❌ Pehle GitHub Gist URL paste karo line 8 par!');
        return;
    }

    const umi = createUmi('https://api.mainnet-beta.solana.com');
    const keypairData = JSON.parse(fs.readFileSync('payer-keypair.json'));
    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(keypairData));
    const signer = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(signer));

    await createV1(umi, {
        mint: publicKey('LQw8SiMtTvxQ1gKsNJ2UdY2whyaWTLDSHsgYXasFeMs'),
        authority: signer,
        name: 'RUGWIFHAT',
        symbol: 'RWH',
        uri: METADATA_URI,
        sellerFeeBasisPoints: 0,
        tokenStandard: TokenStandard.Fungible
    }).sendAndConfirm(umi);

    console.log('✅ Metadata updated!');
    console.log('URI:', METADATA_URI);
}

main().catch(console.error);
