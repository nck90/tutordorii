import { PrismaClient } from './src/generated/prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'seojin@studydol.com' }
    })
    console.log("User:", user)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
