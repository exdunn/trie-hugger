import React, { Component } from "react";
import * as d3 from "d3";
import Trie from "./Trie";

const DURATION = 750;

class TrieTree extends Component {
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
        prevProps.color != this.props.color) &&
      this.props.searchValue !== undefined
    ) {
      updateTrie(this.props);
    }
  }

  render() {
    return <div className="trie-tree" />;
  }
}

function deleteTrie() {
  d3.selectAll(".trie-canvas").remove();
}

function isRootOrRootOf(s1, s2) {
  return s1.startsWith(s2) || s2.startsWith(s1);
}

function updateTrie(props) {
  let svg = d3.select(".trie-tree");

  svg
    .selectAll("path")
    .transition()
    .duration(200)
    .attr("stroke-width", d =>
      isRootOrRootOf(props.searchValue, d.target.data.string.slice(1))
        ? props.pathWidth
        : 1
    )
    .style("stroke", d =>
      isRootOrRootOf(props.searchValue, d.target.data.string.slice(1))
        ? props.color
        : props.defaultColor
    );

  svg
    .selectAll("circle")
    .transition()
    .duration(200)
    .attr(
      "r",
      d =>
        props.circleRadius *
        (isRootOrRootOf(props.searchValue, d.data.string.slice(1)) &&
        d.data.isWord
          ? 2.5
          : 1)
    );

  svg
    .selectAll("rect")
    .transition()
    .duration(200)
    .style("opacity", d =>
      isRootOrRootOf(props.searchValue, d.data.string.slice(1)) && d.data.isWord
        ? 1
        : 0
    );

  svg
    .selectAll("text")
    .transition()
    .duration(200)
    .style("opacity", d =>
      isRootOrRootOf(props.searchValue, d.data.string.slice(1)) && d.data.isWord
        ? 1
        : 0
    );
}

function createTrie(data, props) {
  let width = parseInt(d3.select(".trie-tree").style("width"), 10);
  let height = window.innerHeight;

  let svg = d3
    .select(".trie-tree")
    .append("svg")
    .attr("class", "trie-canvas")
    .style("width", width)
    .style("height", height)
    .append("g")
    .attr("transform", "translate(25, 25)"); // shift everything to the right and down

  let root = d3
    .stratify()
    .id(d => d.string)
    .parentId(d => d.parent)(data);

  let tree = d3.tree().size([width * 0.9, height * 0.8]);
  tree(root);

  let nodes = svg.selectAll("node").data(root.descendants());

  let diagonal = d3
    .linkVertical()
    .source(d => {
      return { x: d.source.x, y: d.source.y + 7 };
    })
    .target(d => {
      return { x: d.target.x, y: d.target.y - 7 };
    })
    .x(d => d.x)
    .y(d => d.y);

  svg
    .attr("class", "paths")
    .selectAll("path")
    .data(root.links())
    .enter()
    .append("path")
    .attr("fill", "none")
    .attr("stroke", props.defaultColor)
    .attr("stroke-width", 1)
    .attr("d", diagonal);

  nodes
    .enter()
    .append("g")
    .attr("class", "node")
    .call(parent => {
      parent
        .append("circle")
        .style("fill", "#fff")
        .style("stroke-width", 3)
        .style("stroke", "#555")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("r", props.circleRadius);
      parent
        .append("rect")
        .style("fill", "#fff")
        .style("stroke-width", 1)
        .style("stroke", "#555")
        .style("opacity", 0)
        .attr("x", d => d.x - 5 - d.data.string.length * 3)
        .attr("y", d => d.y + 15)
        .attr("width", d => d.data.string.length * 8.5)
        .attr("height", 20);
      parent
        .append("text")
        .text(d => d.data.string.slice(1))
        .style("opacity", 0)
        .style("z-index", 1)
        .attr("x", d => d.x - d.data.string.length * 3)
        .attr("y", d => d.y + 30);
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
        .duration(200)
        .attr("r", props.circleRadius * 2.5);
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
        .attr("r", props.circleRadius);
    });
}

export default TrieTree;
