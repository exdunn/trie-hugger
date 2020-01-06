import React, { Component } from "react";
import { LoremIpsum } from "lorem-ipsum";
import "./Triezone.css";
import TrieControls from "./TrieControls";
import TrieTextCard from "./TrieTextCard";
import TrieTree from "./TrieTree";
import TriePack from "./TriePack";

class Triezone extends Component {
  state = {
    searchValue: "",
    words: [],
    color: "red",
    colorScale: "spectral",
    display: "tree",
    defaultColor: "lightslategrey",
    pathWidth: 3.5,
    circleRadius: 5,
    text: "",
    current: 0,
    treeButtonDisabled: false
  };

  handleSearchChange = value => {
    this.setState({ searchValue: value });
  };

  handleColorSelect = color => {
    this.setState({ color });
  };

  handleColorScaleSelect = colorScale => {
    this.setState({ colorScale });
  };
  handleDisplaySelect = display => {
    this.setState({ display });
  };

  handleReadClick = () => {
    this.setState({ treeButtonDisabled: true });
    setTimeout(() => {
      this.setState({ treeButtonDisabled: false });
    }, this.state.words.length * 250);

    for (let i = 0; i < this.state.words.length; i++) {
      setTimeout(() => {
        this.setState({ current: i });
        this.setState({ searchValue: this.state.words[i] });
      }, i * 250);
    }
  };

  handleGenerateClick = e => {
    e.stopPropagation();

    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
    });
    let par = lorem.generateParagraphs(1);
    this.setState({ text: par });
    this.setState({
      words: par
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .split(" ")
    });
  };

  handleWordHover = i => {
    this.setState({ current: i });
    this.setState({ searchValue: this.state.words[i] });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <TrieControls
            words={this.state.words}
            onSearchChange={e => this.handleSearchChange(e.target.value)}
            searchValue={this.state.searchValue}
            onColorSelect={this.handleColorSelect}
            onColorScaleSelect={this.handleColorScaleSelect}
            onDisplaySelect={this.handleDisplaySelect}
            onReadClick={this.handleReadClick}
            onGenerateClick={this.handleGenerateClick}
            treeButtonDisabled={this.state.treeButtonDisabled}
          />
        </div>

        <div className="row trie-content">
          <div className="col">
            <TrieTextCard
              text={this.state.text}
              color={this.state.color}
              current={this.state.current}
              onWordHover={this.handleWordHover}
            />
          </div>
          <div className="col-9">{this.makeTrie()}</div>
        </div>
      </div>
    );
  }

  makeTrie() {
    if (this.state.display == "tree") {
      return (
        <TrieTree
          searchValue={this.state.searchValue}
          color={this.state.color}
          defaultColor={this.state.defaultColor}
          pathWidth={this.state.pathWidth}
          circleRadius={this.state.circleRadius}
          text={this.state.text}
          current={this.state.current}
        />
      );
    } else {
      return (
        <TriePack
          searchValue={this.state.searchValue}
          colorScale={this.state.colorScale}
          pathWidth={this.state.pathWidth}
          circleRadius={this.state.circleRadius}
          text={this.state.text}
          current={this.state.current}
        />
      );
    }
  }
}

export default Triezone;
