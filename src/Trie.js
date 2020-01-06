import { Orders } from "./Enums";

// Character that we will use for trie tree root.
const HEAD_CHARACTER = "*";

export default class Trie {
  /**
   * Splits a text up by spaces and converts the words into a trie
   * @param {string} text
   */
  constructor(text) {
    this.head = new TrieNode(HEAD_CHARACTER);

    if (!text || !text.length) {
      return;
    }

    let formatText = text.toLowerCase().replace(/[^\w\s]/gi, "");
    let words = formatText.split(" ");

    for (let w of words) {
      this.addWord(w);
    }
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  addWord(word) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      const isComplete = charIndex === characters.length - 1;
      currentNode = currentNode.addChild(characters[charIndex], isComplete);
    }

    return this;
  }

  /**
   * @param {string} word
   * @return {Trie}
   */
  deleteWord(word) {
    const depthFirstDelete = (currentNode, charIndex = 0) => {
      if (charIndex >= word.length) {
        // Return if we're trying to delete the character that is out of word's scope.
        return;
      }

      const character = word[charIndex];
      const nextNode = currentNode.getChild(character);

      if (nextNode == null) {
        // Return if we're trying to delete a word that has not been added to the Trie.
        return;
      }

      // Go deeper.
      depthFirstDelete(nextNode, charIndex + 1);

      // Since we're going to delete a word let's un-mark its last character isCompleteWord flag.
      if (charIndex === word.length - 1) {
        nextNode.isCompleteWord = false;
      }

      // childNode is deleted only if:
      // - childNode has NO children
      // - childNode.isCompleteWord === false
      currentNode.removeChild(character);
    };

    // Start depth-first deletion from the head node.
    depthFirstDelete(this.head);

    return this;
  }

  /**
   * @param {string} word
   * @return {string[]}
   */
  suggestNextCharacters(word) {
    const lastCharacter = this.getLastCharacterNode(word);

    if (!lastCharacter) {
      return null;
    }

    return lastCharacter.suggestChildren();
  }

  /**
   * Check if complete word exists in Trie.
   *
   * @param {string} word
   * @return {boolean}
   */
  doesWordExist(word) {
    const lastCharacter = this.getLastCharacterNode(word);

    return !!lastCharacter && lastCharacter.isCompleteWord;
  }

  /**
   * @param {string} word
   * @return {TrieNode}
   */
  getLastCharacterNode(word) {
    const characters = Array.from(word);
    let currentNode = this.head;

    for (let charIndex = 0; charIndex < characters.length; charIndex += 1) {
      if (!currentNode.hasChild(characters[charIndex])) {
        return null;
      }

      currentNode = currentNode.getChild(characters[charIndex]);
    }

    return currentNode;
  }

  /**
   * Create a tree that is used in d3.stratify()
   */
  getTree() {
    if (!this.head) {
      return;
    }

    let tree = [];
    let stack = [[this.head, "", 0]];

    while (stack.length > 0) {
      let [node, string] = stack.pop();
      let newWord = string + node.character;

      tree.unshift({
        string: newWord,
        parent: string,
        isWord: node.isCompleteWord
      });

      for (let key of node.children.keys()) {
        stack.push([node.getChild(key), newWord]);
      }
    }

    return tree.sort((a, b) => (a.string > b.string ? 1 : -1));
  }

  /**
   * Returns words in Trie
   */
  getWords() {
    if (!this.head) {
      return;
    }

    let words = [];
    let stack = [[this.head, ""]];

    while (stack.length > 0) {
      let [node, word] = stack.pop();

      if (node.isCompleteWord) {
        words.push(word);
      }

      for (let key of node.children.keys()) {
        stack.push([node.getChild(key), word + key]);
      }
    }
    return words;
  }
}

class TrieNode {
  /**
   * @param {string} character
   * @param {boolean} isCompleteWord
   */
  constructor(character, isCompleteWord = false) {
    this.character = character;
    this.isCompleteWord = isCompleteWord;
    this.children = new Map();
  }

  /**
   * @param {string} character
   * @return {TrieNode}
   */
  getChild(character) {
    return this.children.get(character);
  }

  /**
   * @param {string} character
   * @param {boolean} isCompleteWord
   * @return {TrieNode}
   */
  addChild(character, isCompleteWord = false) {
    if (!this.children.has(character)) {
      this.children.set(character, new TrieNode(character, isCompleteWord));
    }

    const childNode = this.children.get(character);

    // In cases similar to adding "car" after "carpet" we need to mark "r" character as complete.
    childNode.isCompleteWord = childNode.isCompleteWord || isCompleteWord;

    return childNode;
  }

  /**
   * @param {string} character
   * @return {TrieNode}
   */
  removeChild(character) {
    const childNode = this.getChild(character);

    // Delete childNode only if:
    // - childNode has NO children,
    // - childNode.isCompleteWord === false.
    if (childNode && !childNode.isCompleteWord && !childNode.hasChildren()) {
      this.children.delete(character);
    }

    return this;
  }

  /**
   * @param {string} character
   * @return {boolean}
   */
  hasChild(character) {
    return this.children.has(character);
  }

  /**
   * Check whether current TrieNode has children or not.
   * @return {boolean}
   */
  hasChildren() {
    return this.children.getKeys().length !== 0;
  }

  /**
   * @return {string[]}
   */
  suggestChildren() {
    return [...this.children.getKeys()];
  }

  /**
   * @return {string}
   */
  toString() {
    let childrenAsString = this.suggestChildren().toString();
    childrenAsString = childrenAsString ? `:${childrenAsString}` : "";
    const isCompleteString = this.isCompleteWord ? "*" : "";

    return `${this.character}${isCompleteString}${childrenAsString}`;
  }
}
