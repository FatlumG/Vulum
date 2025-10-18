"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const yargs_1 = __importDefault(require("yargs"));
const VersionCommand_1 = require("@base/api/commands/Common/VersionCommand");
yargs_1.default
    .usage('Usage: cli <command> [options]')
    .command(new VersionCommand_1.VersionCommand())
    .demandCommand(1, 'Please provide a valid command.')
    .strict()
    .help('help')
    .alias('help', 'h').argv;
//# sourceMappingURL=cli.js.map