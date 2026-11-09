param(
  [Parameter(Mandatory=$true)][string]$OutputDirectory
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer
$voice.SelectVoice('Microsoft Huihui Desktop')
$voice.Rate = 4
$voice.Volume = 100
$cues = @(
  @{ id='c1'; text='葡萄糖先离开毛细血管。'; start_s=0.6; end_s=4.7; highlighted_event_t=2.3 },
  @{ id='c2'; text='它经过组织间隙。'; start_s=4.8; end_s=8.5; highlighted_event_t=6.3 },
  @{ id='c3'; text='再跨过肌细胞膜进入细胞。'; start_s=8.6; end_s=13.3; highlighted_event_t=10.8 }
)
foreach ($cue in $cues) {
  $path = Join-Path $OutputDirectory ($cue.id + '.wav')
  $voice.SetOutputToWaveFile($path)
  $voice.Speak($cue.text)
  $voice.SetOutputToNull()
}
$voice.Dispose()
$record = [ordered]@{
  voice = 'Microsoft Huihui Desktop'
  culture = 'zh-CN'
  purpose = 'temporary local technical sync proof; not final programme narration'
  rights_note = 'Generated locally from a Windows system voice; redistribution rights were not independently audited, so this track is test-only and must not be treated as final licensed narration.'
  cues = $cues
}
$record | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'cue-plan.json') -Encoding utf8
