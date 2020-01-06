import React, { Component } from "react";
import * as d3 from "d3";
import Trie from "./Trie";
import { mapColorScaleToD3Interpolation } from "./Enums";

class TriePack extends Component {
  componentDidMount() {
    if (this.props.text) {
      let trie = new Trie(this.props.text);
      createTrie(trie.getTree(), this.props);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.text != this.props.text) {
      deleteTrie();
      if (this.props.text) {
        let trie = new Trie(this.props.text);
        createTrie(trie.getTree(), this.props);
      }
    }

    if (
      (prevProps.searchValue !== this.props.searchValue ||
        prevProps.colorScale != this.props.colorScale) &&
      this.props.searchValue !== undefined
    ) {
      updateTrie(this.props);
    }
  }

  render() {
    return <div className="trie-pack" />;
  }
}

function deleteTrie() {
  d3.selectAll(".trie-canvas").remove();
}

function isRootOrRootOf(s1, s2) {
  return s1.startsWith(s2) || s2.startsWith(s1);
}

function updateTrie(props) {
  let root = d3.select("circle").data();
  let color = d3.scaleSequential(
    [root[0].height, 0],
    mapColorScaleToD3Interpolation(props.colorScale)
  );

  let svg = d3.select(".trie-pack");

  svg
    .selectAll("circle")
    .transition()
    .duration(150)
    .attr("r", d => {
      return isRootOrRootOf(props.searchValue, d.data.string.slice(1))
        ? d.r * (1 + d.depth * 0.1)
        : d.r;
    })
    .style("fill", d => color(d.height));

  svg
    .selectAll("rect")
    .style("opacity", d =>
      isRootOrRootOf(props.searchValue, d.data.string.slice(1)) && d.data.isWord
        ? 1
        : 0
    );

  svg
    .selectAll("text")
    .style("opacity", d =>
      isRootOrRootOf(props.searchValue, d.data.string.slice(1)) && d.data.isWord
        ? 1
        : 0
    );
}

function createTrie(data, props) {
  let width = parseInt(d3.select(".trie-pack").style("width"), 10);
  let height = window.innerHeight;

  let root = d3
    .stratify()
    .id(d => d.string)
    .parentId(d => d.parent)(data);

  let pack = () =>
    d3
      .pack()
      .size([width * 0.9, height * 0.8])
      .padding(10)(
        root.sum(d => {
          return 100;
        })
      )
      .sort((a, b) => {
        return b.value - a.value;
      });

  pack(root);

  let svg = d3
    .select(".trie-pack")
    .append("svg")
    .attr("class", "trie-canvas")
    .style("width", width)
    .style("height", height)
    .append("g")
    .attr("transform", "translate(25, 25)"); // shift everything to the right and down

  let nodes = svg.selectAll("g").data(root.descendants());

  let color = d3.scaleSequential(
    [root.height, 0],
    mapColorScaleToD3Interpolation(props.colorScale)
  );

  nodes
    .enter()
    .append("g")
    .attr("class", "node")
    .call(parent => {
      parent
        .append("circle")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
        .attr("r", d => d.r)
        .attr("fill", d => color(d.height))
        .attr("opacity", 1)
        .attr("stroke", "slategrey")
        .attr("stroke-wdith", 2);
      parent
        .append("rect")
        .style("fill", "#fff")
        .style("stroke-width", 1)
        .style("stroke", "#555")
        .style("opacity", 0)
        .attr("x", d => d.x - 5 - d.data.string.length * 3)
        .attr("y", d => d.y - 30)
        .attr("width", d => d.data.string.length * 8.5)
        .attr("height", 20);
      parent
        .append("text")
        .attr("x", d => d.x - d.data.string.length * 3)
        .attr("y", d => d.y - 15)
        .style("z-index", 3)
        .style("opacity", 0)
        .text(d => d.data.string.slice(1));
    })
    .on("mouseover", function(d) {
      d3.select(this)
        .select("text")
        .style("opacity", 1);
      d3.select(this)
        .select("rect")
        .style("opacity", 1);
      d3.select(this)
        .select("circle")
        .transition()
        .duration(150)
        .attr("r", d => d.r * (1 + d.depth * 0.1));
    })
    .on("mouseout", function(d) {
      d3.select(this)
        .select("text")
        .style("opacity", 0);
      d3.select(this)
        .select("rect")
        .style("opacity", 0);
      d3.select(this)
        .select("circle")
        .transition()
        .duration(200)
        .attr("r", d => d.r);
    });
}

export default TriePack;
