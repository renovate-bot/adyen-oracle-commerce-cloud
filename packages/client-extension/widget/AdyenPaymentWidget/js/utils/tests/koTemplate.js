import fs from "fs";
import path from "path";
import ko from "knockout";
import viewModel from "../../adyen-checkout";

const generateTemplate = (widget, cb) => {
    const template = fs.readFileSync(path.resolve(__dirname, '../../../templates/display.template'))
    const node = document.createElement('div')
    node.innerHTML = template.toString();

    ko.templateSources.stringTemplate = function (template, templates) {
        this.templateName = template;
        this.templates = templates;
    }

    function createStringTemplateEngine(templateEngine, templates) {
        templateEngine.makeTemplateSource = function (template) {
            return new ko.templateSources.stringTemplate(template, templates);
        }
        return templateEngine;
    }

    ko.setTemplateEngine(createStringTemplateEngine(new ko.nativeTemplateEngine(), viewModel.templates));

    viewModel.onLoad(widget)
    cb && cb(viewModel)
    ko.applyBindings(viewModel, node);
    return node;
}

export default generateTemplate