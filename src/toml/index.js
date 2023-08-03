import parser from './lib/parser';
import compiler from "./lib/compiler";


export default {
  parse(input) {
    var nodes = parser.parse(input.toString());
    return compiler.compile(nodes);
  }
};
