import { getConfig, getEffectiveUrl, getSchemaWithPath } from '@prisma/internals'

import { SchemaEngine } from '../SchemaEngine'
import { EngineArgs, EngineResults } from '../types'

export async function introspectSql(
  schemaPath: string | undefined,
  queries: EngineArgs.SqlQueryInput[],
): Promise<EngineResults.IntrospectSqlOutput> {
  const schema = await getSchemaWithPath(schemaPath)
  const config = await getConfig({ datamodel: schema.schemas })
  const firstDatasource = config.datasources[0]
  if (!firstDatasource) {
    throw new Error(`Could not find datasource in schema ${schema.schemaPath}`)
  }
  const url = getEffectiveUrl(firstDatasource).value
  if (!url) {
    // TODO: better error
    throw new Error(`Could not get url from datasource ${firstDatasource.name} in ${schema.schemaPath}`)
  }

  const schemaEngine = new SchemaEngine({ schemaPath: schema.schemaPath })
  try {
    const result = await schemaEngine.introspectSql({
      url,
      queries,
      force: false,
    })
    return result
  } finally {
    schemaEngine.stop()
  }
}
