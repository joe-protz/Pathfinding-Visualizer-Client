import React from 'react'
const legendStyle = {
  width: '25px',
  margin: '8px'
}
const Legend = () => (
  <div>
    <div className="row">
      &nbsp;
      <h5>Legend</h5>
    </div>
    <div className="row">
      <div className="mt-2">Start/End:</div>
      <div
        className="col-1 sq"
        style={{ ...legendStyle, background: '#ff00c8' }}
      >
        &nbsp;
      </div>
      <div className="mt-2">Wall:</div>
      <div className="col-1 sq" style={{ ...legendStyle, background: 'black' }}>
        &nbsp;
      </div>
      <div className="mt-2">Open Set:</div>
      <div
        className="col-1 sq"
        style={{
          ...legendStyle,
          background: '#00ff00',
          opacity: '0.5'
        }}
      >
        &nbsp;
      </div>
      <div className="mt-2">Closed Set:</div>
      <div
        className="col-1 sq"
        style={{
          ...legendStyle,
          background: '#FF0000',
          opacity: '0.5'
        }}
      >
        &nbsp;
      </div>
      <div className="mt-2"> Weighted Cell:</div>
      <div
        className="col-1 sq"
        style={{
          ...legendStyle,
          background: '#0000FF'
        }}
      >
        &nbsp;
      </div>
      <div className="mt-2">Weighted & Open:</div>
      <div
        className="col-1 sq"
        style={{
          ...legendStyle,
          background: '#00FF00'
        }}
      >
        &nbsp;
      </div>
      <div className="mt-2"> Weighted & Closed:</div>
      <div
        className="col-1 sq"
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
