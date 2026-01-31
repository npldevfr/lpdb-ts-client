import { LPDBClient, LPDBError } from '../src'

const apiKey = process.env.LIQUIPEDIA_API_KEY
if (!apiKey) {
  console.error('Missing LIQUIPEDIA_API_KEY environment variable')
  process.exit(1)
}

const client = new LPDBClient({ apiKey })

async function main() {
  try {
    const players = await client.endpoint('/player').wiki('dota2').limit(5).execute()
    console.log('Players:', JSON.stringify(players, null, 2))

    const matches = await client.endpoint('/match').wikis(['counterstrike']).limit(3).execute()
    console.log('Matches:', JSON.stringify(matches, null, 2))

    const template = await client
      .endpoint('/teamtemplate')
      .wiki('dota2')
      .template('teamliquid')
      .execute()
    console.log('Team Template:', JSON.stringify(template, null, 2))

    const tournaments = await client
      .endpoint('/tournament')
      .wiki('leagueoflegends')
      .limit(3)
      .order('startdate DESC')
      .execute()
    console.log('Tournaments:', JSON.stringify(tournaments, null, 2))

    const query = client
      .endpoint('/player')
      .wiki('leagueoflegends')
      .conditions('[[pagename::Caliste]]')
      .limit(10)
      .build()
    console.log('Built query:', query)
  } catch (error) {
    if (error instanceof LPDBError) {
      console.error(`API Error (${error.status}):`, error.message)
      console.error('Data:', error.data)
    } else {
      throw error
    }
  }
}

main()
