import fs from "fs";
import path from "path";
import ko from "knockout";
import viewModel from "../../adyen-checkout";

const generateTemplate = (widget, cb) => {
    const template = fs.readFileSync(path.resolve(__dirname, '../../../templates/display.template'))
    const node = document.createElement('div')
    node.innerHTML = template.toString();

    viewModel.onLoad(widget)
    cb && cb(viewModel)
    ko.applyBindings(viewModel, node);
    return node;
}

export default generateTemplate