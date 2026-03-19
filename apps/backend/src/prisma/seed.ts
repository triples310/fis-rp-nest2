import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from '../seeder/seeder.service';

async function bootstrap() {
  console.log('🌱 Starting database seeding...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  try {
    await seederService.seedAll();
    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📋 Default admin credentials:');
    console.log('   Account: admin');
    console.log('   Password: 123456');
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
