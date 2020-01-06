import React, { Component } from "react";
import "./TrieTextCard.css";

class TrieTextCard extends Component {
  render() {
    return (
      <div
        className="card"
        style={{ display: this.props.text == "" ? "none" : "block" }}
      >
        <div className="card-body">
          {this.props.text.split(" ").map((word, i) => (
            <span
              className="word"
              style={{
                color: i == this.props.current ? this.props.color : "",
                fontWeight: i == this.props.current ? 700 : 400
              }}
              onMouseEnter={() => this.props.onWordHover(i)}
            >
              {word}{" "}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default TrieTextCard;
