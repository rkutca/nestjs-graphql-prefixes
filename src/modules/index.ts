import { Module } from '@nestjs/common';
import { GraphQLReverseProxy } from './graphql-module';
import { RecipesModule } from '../recipes/recipe.module'

@Module({
  imports: [
    GraphQLReverseProxy,
    RecipesModule
  ],
})
export class AppModule {}
