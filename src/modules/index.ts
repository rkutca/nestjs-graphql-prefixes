import { Module } from '@nestjs/common';
import { SearchDutchBusinessModule } from './graphql-module';
import { RecipesModule } from '../recipes/recipe.module'

@Module({
  imports: [
    SearchDutchBusinessModule,
    RecipesModule
  ],
})
export class AppModule {}
