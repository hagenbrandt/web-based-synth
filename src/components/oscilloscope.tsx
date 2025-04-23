import { useEffect, useRef } from 'react';
import { scaleLinear } from 'd3-scale';
import { line, curveLinear } from 'd3-shape';
import { select } from 'd3-selection';

interface OscilloscopeProps {
  waveformRef: React.MutableRefObject<Float32Array>;
  label?: string;
}

export const Oscilloscope = ({ waveformRef, label }: OscilloscopeProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = select(svgRef.current);

    const width = svgRef.current?.getBoundingClientRect().width || 300;
    const height = svgRef.current?.getBoundingClientRect().height || 200;

    const xScale = scaleLinear()
      .domain([0, waveformRef.current.length])
      .range([0, width]);

    const yScale = scaleLinear().domain([-1, 1]).range([height, 0]);

    const lineGen = line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(curveLinear);

    let animationId: number;

    const render = () => {
      const waveform = waveformRef.current;
      svg.selectAll('*').remove();

      svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#111');

      svg
        .append('path')
        .datum(Array.from(waveform))
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 1.5)
        .attr('d', lineGen);

      if (label) {
        svg
          .append('text')
          .attr('x', 10)
          .attr('y', 15)
          .attr('fill', 'lightgray')
          .attr('font-size', '12px')
          .text(label);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [waveformRef, label]);

  return <svg className="oscilloscope" ref={svgRef} />;
};
