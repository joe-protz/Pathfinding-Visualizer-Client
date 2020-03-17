import React from 'react'
const legendStyle = {
  width: '25px',
  margin: '8px'
}
const Legend = () => (
  <div className="col-2">
    &nbsp;
    <h5>Legend</h5>
    <div>
      Start/End/Path:
      <div style={{ ...legendStyle, background: '#ff00c8' }}>&nbsp;</div>
      Wall:
      <div style={{ ...legendStyle, background: 'black' }}>&nbsp;</div>
      Open Set:
      <div
        style={{
          ...legendStyle,
          background: '#00ff00',
          opacity: '0.5'
        }}
      >
        &nbsp;
      </div>
      Closed Set:
      <div
        style={{
          ...legendStyle,
          background: '#FF0000',
          opacity: '0.5'
        }}
      >
        &nbsp;
      </div>
      Weighted Cell:
      <div
        style={{
          ...legendStyle,
          background: '#0000FF'
        }}
      >
        &nbsp;
      </div>
      Weighted & Open:
      <div
        style={{
          ...legendStyle,
          background: '#00FF00'
        }}
      >
        &nbsp;
      </div>
      Weighted & Closed:
      <div
        style={{
          ...legendStyle,
          background: '#FF0000'
        }}
      >
        &nbsp;
      </div>
    </div>
  </div>
)
export default Legend
