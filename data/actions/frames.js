/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

const types = {
  CLEAR: "CLEAR",
  ADD_FRAME: "ADD_FRAME",
  ADD_FRAMES: "ADD_FRAMES",
  FILTER_FRAMES: "FILTER_FRAMES",
  TOGGLE_PAUSE: "TOGGLE_PAUSE",
}

function clear() {
  return { type: types.CLEAR };
}

function addFrame(frame) {
  return { type: types.ADD_FRAME, frame: frame };
}

function addFrames(frames) {
  return { type: types.ADD_FRAMES, frames: frames };
}

function filterFrames(filter) {
  return { type: types.FILTER_FRAMES, filter: filter };
}

function togglePause() {
  return { type: types.TOGGLE_PAUSE };
}

// Exports from this module
exports.clear = clear;
exports.addFrame = addFrame;
exports.addFrames = addFrames;
exports.filterFrames = filterFrames;
exports.togglePause = togglePause;
exports.types = types;
});

