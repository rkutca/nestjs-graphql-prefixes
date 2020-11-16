import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

const isProduction = process.env.NODE_ENV === 'prod';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src', 'schemas', 'schema.gql'),
      debug: !isProduction,
      path: '/graphql-prefix',
      playground: !isProduction,
      sortSchema: true,
      useGlobalPrefix: true,
    }),
  ],
})
export class GraphQLReverseProxy {}
