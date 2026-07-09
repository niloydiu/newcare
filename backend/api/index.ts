import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { v2 as cloudinary } from 'cloudinary';

const server = express();
let app: any;

const bootstrap = async () => {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    
    // Enable CORS
    app.enableCors();

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    await app.init();
  }
  return app;
};

export default async (req: any, res: any) => {
  await bootstrap();
  server(req, res);
};
