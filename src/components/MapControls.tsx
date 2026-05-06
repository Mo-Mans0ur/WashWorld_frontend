'use client'

type MapControlsProps = {
  is3D: boolean
  pitch: number
  lightPreset: 'dawn' | 'day' | 'dusk' | 'night'
  onToggle3D: () => void
  onCycleLightPreset: () => void
  onPitchChange: (pitch: number) => void
}

export default function MapControls({
  is3D,
  pitch,
  lightPreset,
  onToggle3D,
  onCycleLightPreset,
  onPitchChange,
}: MapControlsProps) {
  const presetLabels: Record<MapControlsProps['lightPreset'], string> = {
    dawn: 'DWN',
    day: 'DAY',
    dusk: 'DSK',
    night: 'NGT',
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '115px',
        right: '10px',
        zIndex: 10,
        width: '32px',
      }}
    >
      <button
        type="button"
        onClick={onToggle3D}
        style={{
          width: '32px',
          height: '32px',
          marginBottom: is3D ? '8px' : '8px',
          border: 'none',
          borderRadius: '4px',
          background: '#fff',
          color: '#333',
          cursor: 'pointer',
          fontWeight: 700,
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {is3D ? '3D' : '2D'}
      </button>
      
      <div
        style={{
          background: '#fff',
          borderRadius: '4px',
          width: '32px',
          height: '120px',
          padding: '6px 0',
          marginBottom: '8px',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
          display: is3D ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column',
        }}
      >
        <input
          type="range"
          min={30}
          max={70}
          step={1}
          value={pitch}
          onChange={(event) => onPitchChange(Number(event.target.value))}
          disabled={!is3D}
          style={{
            width: '30px',
            height: '70px',
            writingMode: 'vertical-lr',
            WebkitAppearance: 'slider-vertical',
            cursor: is3D ? 'pointer' : 'not-allowed',
            opacity: is3D ? 1 : 0.5,
          }}
        />
        <span style={{ fontSize: '10px', color: '#333', lineHeight: 1 }}>{pitch}</span>
      </div>

      <button
        type="button"
        onClick={onCycleLightPreset}
        title={`Lys: ${lightPreset}`}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '4px',
          background: '#fff',
          color: '#333',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '10px',
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {presetLabels[lightPreset]}
      </button>
    </div>
  )
}
