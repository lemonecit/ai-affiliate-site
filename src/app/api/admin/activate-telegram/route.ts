import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    console.log('Activating Telegram bot...')
    
    // Kontrollera om BOT_TOKEN finns
    if (!process.env.BOT_TOKEN) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'BOT_TOKEN not configured in environment variables'
        },
        { status: 400 }
      )
    }
    
    // Starta Telegram bot i bakgrunden
    const { stdout, stderr } = await execAsync('python telegram_bot.py &', {
      cwd: process.cwd(),
      timeout: 10000 // 10 sekunder för att starta boten
    })
    
    console.log('Telegram bot activation output:', stdout)
    if (stderr) {
      console.error('Telegram bot errors:', stderr)
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Telegram bot activation initiated',
      output: stdout
    })
  } catch (error) {
    console.error('Error activating Telegram bot:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to activate Telegram bot. Make sure BOT_TOKEN is configured.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
