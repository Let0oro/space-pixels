const CustomPerfomance = () => {
  return (
    <div style={{position: 'fixed', top: "1rem", right: "1rem", textAlign:"left"}}>
        <h4>Performance</h4>
        <ul>
          <li><b>EventCounts: </b>{window.performance.eventCounts.size}</li>
          <li><b>MemoryInfo: </b>(usedJSHeapSize
          ) {"->"} {window.performance?.memory?.usedJSHeapSize} bits</li>
          <li><b>domLoading: </b>{new Date(window.performance.timing.domLoading).getSeconds()} s</li>
          <li><b>domInteractive: </b>{new Date(window.performance.timing.domInteractive).getSeconds()} s</li>
        </ul>
      </div>
  )
}

export default CustomPerfomance