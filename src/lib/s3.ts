import { env } from "~/env";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY

    }
})


export async function getPresignedUrl({
    key,
    expiresIn = 3600,
    bucket = env.S3_BUCKET_NAME,
}: {
    key: string,
    expiresIn?: number,
    bucket?: string
}): Promise<string> {

    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
    })

    return getSignedUrl(s3Client, command, { expiresIn })

}