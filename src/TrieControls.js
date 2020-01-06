import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faTree } from "@fortawesome/free-solid-svg-icons";
import "./TrieControls.css";
import { Colors, ColorScales } from "./Enums";

class TrieControls extends Component {
  state = {
    color: "color",
    colorScale: "color scale",
    display: "display",
    treeButtonDisabled: false
  };

  handleColorClick = color => {
    this.setState({ color });
  };

  handleColorScaleClick = colorScale => {
    this.setState({ colorScale });
  };

  handleDisplayClick = display => {
    this.setState({ display });
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center trie-controls">
          <button
            type="button"
            className="btn btn-success btn-sm icon-btn"
            onClick={this.props.onGenerateClick}
            disabled={this.props.treeButtonDisabled}
          >
            generate
            <FontAwesomeIcon className="icon" icon={faTree} size="3x" />
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm icon-btn"
            onClick={this.props.onReadClick}
          >
            read
            <FontAwesomeIcon className="icon" icon={faBookOpen} size="3x" />
          </button>

          <datalist id="words">
            {this.props.words
              .filter(word => word.startsWith(this.props.searchValue))
              .slice(0, 3)
              .map(word => (
                <option value={word} />
              ))}
          </datalist>
          <input
            type="text"
            className="form-control search-bar"
            placeholder="Type Something Here..."
            onChange={e => this.props.onSearchChange(e)}
            list="words"
          ></input>

          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
            >
              {this.state.color}
            </button>
            <div className="dropdown-menu">
              {Object.values(Colors).map(color => {
                return (
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      this.props.onColorSelect(color.replace(" ", ""));
                      this.handleColorClick(color);
                    }}
                  >
                    {color}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
            >
              {this.state.colorScale}
            </button>
            <div className="dropdown-menu">
              {Object.values(ColorScales).map(colorScale => {
                return (
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      this.props.onColorScaleSelect(colorScale);
                      this.handleColorScaleClick(colorScale);
                    }}
                  >
                    {colorScale}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
            >
              {this.state.display}
            </button>
            <div className="dropdown-menu">
              {displays.map(display => {
                return (
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={() => {
                      this.props.onDisplaySelect(display);
                      this.handleDisplayClick(display);
                    }}
                  >
                    {display}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const colors = [
  "red",
  "royal blue",
  "orange",
  "violet",
  "turquoise",
  "lime green"
];

const displays = ["tree", "pack"];

export default TrieControls;
