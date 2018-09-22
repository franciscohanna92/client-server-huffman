const bitwise = require('bitwise');
const fs = require('fs');

class TreeNode {
  constructor(token, freq, left, right) {
    this.token = token;
    this.freq = freq;
    this.left = left || null;
    this.right = right || null;
  }

  getFreq() {
    return this.freq;
  }
}

class MaxHeap {
  constructor() {
    this.elements = []
  }

  addItem(item) {
    this.elements.push(item);
    this.elements.sort((item1, item2) => {
      return item1.freq < item2.freq;
    });
  }

  getItem() {
    return this.elements.pop();
  }

  getCount() {
    return this.elements.length;
  }

  getElements() {
    return this.elements;
  }
}

class Huffman {
  constructor(source) {
    source = source ? source : 'source.txt';
    const file = fs.readFileSync(source, 'utf8');

    this.encoding = {}
    this.tree = this.buildTree(file)
    this.generateEncoding(this.tree, '');
  }

  /**
   * Creates the tree to encode and decode strings
   * @param {String} source The source from where to create the coding tree
   */
  buildTree(source) {
    let maxHeap = this.initMaxHeap(source);

    while(maxHeap.getCount() > 1) {
      let node1 = maxHeap.getItem();
      let node2 = maxHeap.getItem();

      let newNode = new TreeNode(null, node1.getFreq() + node2.getFreq(), node1, node2);
      maxHeap.addItem(newNode);
    }
    return maxHeap.getElements()[0];
  }

  /**
   * Initializes the MaxHeap with the frequency of the tokens in the source
   * @param {String} source The text from where to initialize the MaxHeap
   */
  initMaxHeap(source) {
    // First we create an object with the tokens as keys and the frequencies as values
    let tokensFreq = {};
    for (let i = 0; i < source.length; i++) {
      const token = source[i];
      if(tokensFreq.hasOwnProperty(token)) {
        tokensFreq[token]++;
      } else {
        tokensFreq[token] = 1;
      }
    }

    // Then we initialize a MaxHeap with the tokensFreq object as the data for the tree nodes
    let maxHeap = new MaxHeap();
    for(let token in tokensFreq) {
      let treeNode = new TreeNode(token, tokensFreq[token]);
      maxHeap.addItem(treeNode);
    }
    return maxHeap;
  }

  generateEncoding(root, prefix) {
    if(!root.token) {
      this.generateEncoding(root.left, prefix + '0');
      this.generateEncoding(root.right, prefix + '1');
    } else {
      this.encoding[root.token] = prefix;
    }
  }

  encode(string) {
    let code = '';
    for (let i = 0; i < string.length; i++) {
      code += this.encoding[string[i]];
    }
    let bits = code.split('').map(Number);
    const buffer = bitwise.buffer.create(bits)
    return buffer;
  }

  decode(buffer) {
    let decodedBits = bitwise.buffer.read(buffer).join('');
    let root = this.tree;
    let string = ''
    for (let i = 0; i < decodedBits.length; i++) {
      const bit = decodedBits[i];
      if(bit == '0') {
        root = root.left
      } else {
        root = root.right
      }
      if(root.token) {
        string += root.token;
        root = this.tree;
      }
    }
    return string;
  }
}

module.exports = Huffman;

// var huffman = new Huffman();

// let string = 'A'
// let buffer = huffman.encode(string);

// // console.log(buffer);
// // let decodedBits = bitwise.buffer.read(buffer).join('');

// // console.log(decodedBits)
// let decodedString = huffman.decode(buffer)
// console.log(decodedString);