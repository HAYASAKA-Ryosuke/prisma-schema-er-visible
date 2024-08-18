import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import FileUpload from '~/components/FileUpload';
import { generateMermaid } from '~/utils/generateMermaid';
import { parsePrismaSchema } from "@loancrate/prisma-schema-parser";
import { ErDiagramView } from '~/components/ErDiagramView';


export const meta: MetaFunction = () => {
  return [
    { title: "Prisma schema visualization tool" },
    { name: "description", content: "Prisma schema visualization tool" },
  ];
};

export default function Index() {
  const visualizeSchema = async (file: File) => {
    //const schema = await file.text();
    const schema = `
    generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  password  String
  name      String?
  posts     Post[]
  comments  Comment[]
  roles     Role[]    @relation("UserRoles")
  profile   Profile?

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Profile {
  id       Int    @id @default(autoincrement())
  bio      String?
  userId   Int    @unique
  user     User   @relation(fields: [userId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id          Int        @id @default(autoincrement())
  title       String
  content     String
  published   Boolean    @default(false)
  authorId    Int
  author      User       @relation(fields: [authorId], references: [id])
  comments    Comment[]
  categories  Category[] @relation("PostCategories")
  tags        Tag[]      @relation("PostTags")

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([title])
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  post      Post     @relation(fields: [postId], references: [id])
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Category {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  posts Post[]  @relation("PostCategories")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tag {
  id    Int     @id @default(autoincrement())
  name  String  @unique
  posts Post[]  @relation("PostTags")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Role {
  id    Int    @id @default(autoincrement())
  name  String @unique
  users User[] @relation("UserRoles")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])

  @@id([userId, roleId])
  @@unique([userId, roleId])
}

    `;
    const ast = parsePrismaSchema(schema);
    const erd = generateMermaid(ast);
    setErd(erd);
  }
  
  const fileUploadHandler = async (file: File) => {
    visualizeSchema(file);
  }
  
  const [erd, setErd] = useState('');
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Prisma schema visualization tool</h1>
      <p>
	This tool helps you visualize your Prisma schema. It reads your{" "}
	<code>schema.prisma</code> file and renders a diagram of your database
	schema.
      </p>
      <FileUpload fileUploadHandler={fileUploadHandler} />
      <ErDiagramView source={erd ?? ''} id={"a"}/>
    </div>
  );
}
