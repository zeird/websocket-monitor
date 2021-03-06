/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// ReactJS
const React = require("react");

// Firebug SDK
const { Str } = require("reps/core/string");
const { TreeView } = require("reps/tree-view");
const { createFactories } = require("reps/rep-utils");

// WebSockets Monitor
const { selectFrame } = require("../actions/selection");
const { getOpCodeLabel } = require("./frame-utils");
const { NoServiceWarning } = createFactories(require("./no-service-warning"));

// Constants
const { table, thead, th, tbody, tr, td, tfoot, div, span, code, a } = React.DOM;

/**
 * This components implements the main table layout for list of frames.
 */
var FrameTable = React.createClass({
/** @lends FrameTable */

  displayName: "FrameTable",

  componentDidUpdate: function() {
    var row = document.querySelector(".frameRow.selected");
    if (row) {
      this.ensureVisible(row);
    }
  },

  ensureVisible: function(row) {
    var content = document.querySelector(".mainPanelContent");

    if (row.offsetTop < content.scrollTop) {
      content.scrollTop = row.offsetTop;
    }

    if (row.offsetTop + row.offsetHeight > content.scrollTop + content.clientHeight) {
      content.scrollTop = row.offsetTop + row.offsetHeight - content.clientHeight;
    }
  },

  render: function() {
    var {frames, summary, filter} = this.props.frames;
    frames = filter.frames || frames;
    summary = filter.summary || summary;

    // Render list of frames.
    var rows = frames.map(frame => this.getFrameTag(frame)({
      key: frame.id,
      selection: this.props.selection,
      frame: frame,
      dispatch: this.props.dispatch
    }));

    // Render summary info
    var tableFooter;
    if (summary.frameCount) {
      tableFooter = tfoot({className: "frameTFoot"},
        tr({},
          td({colSpan: 8},
            span({}, Locale.$STRP("websocketmonitor.summary.frameCount", [summary.frameCount])),
            span({}, Str.formatSize(summary.totalSize)),
            span({}, Str.formatTime((summary.endTime - summary.startTime) / 1000))
          )
        )
      )
    }

    // If the underlying nsIWebSocketEventService service isn't
    // available in the platform display a warning.
    if (!this.props.wsServiceAvailable) {
      rows = [WarningRow()];
    }

    return (
      table({className: "frameTable"},
        thead({className: "frameTHead"},
          tr({},
            th({className: "direction"}),
            th({className: "socketId"}, Locale.$STR("websocketmonitor.SocketID")),
            th({className: "payloadSize"}, Locale.$STR("websocketmonitor.Size")),
            th({className: "payload"}, Locale.$STR("websocketmonitor.Payload")),
            th({className: "opcode"}, Locale.$STR("websocketmonitor.OpCode")),
            th({className: "bit"}, Locale.$STR("websocketmonitor.MaskBit")),
            th({className: "bit"}, Locale.$STR("websocketmonitor.FinBit")),
            th({className: "time"}, Locale.$STR("websocketmonitor.Time"))
          )
        ),
        tbody({className: "frameTBody"},
          rows
        ),
        tableFooter
      )
    );
  },

  getFrameTag: function(frame) {
    switch (frame.type) {
    case "event":
      return EventRow;
    case "frame":
      return FrameRow;
    }
  }
});

/**
 * Represents a row within the frame list.
 */
var FrameRow = React.createFactory(React.createClass({
/** @lends FrameRow */

  displayName: "FrameRow",

  /**
   * Frames need to be re-rendered only if the selection changes.
   * This is an optimization that makes the list rendering a lot faster.
   */
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.frame == nextProps.selection ||
      this.props.frame == this.props.selection;
  },

  onClick: function() {
    if (this.props.frame != this.props.selection) {
      this.props.dispatch(selectFrame(this.props.frame));
    }
  },

  render: function() {
    var frame = this.props.frame;
    var data = frame.data;

    var className = "frameRow " + (frame.sent ? "send" : "receive");
    var tooltipText = frame.sent ? "Sent" : "Received";

    if (this.props.selection == frame) {
      className += " selected";
    }

    var payload = Str.cropString(data.payload, 50);
    var size = Str.formatSize(data.payload.length);
    var time = new Date(data.timeStamp / 1000);
    var timeText = time.getHours() + ":" + time.getMinutes() +
      ":" + time.getSeconds() + "." + time.getMilliseconds();

    // Test support for inline previews. The problem is the
    // state of the TreeView component.
    /*if (frame.socketIo) {
      var data = { payload: frame.socketIo };
      payload = TreeView({key: "detailsTabTree", data: data})
    }*/

    return (
      tr({className: className, onClick: this.onClick},
        td({className: "direction"},
          div({title: tooltipText})
        ),
        td({className: "socketId"}, frame.webSocketSerialID),
        td({className: "payloadSize"}, size),
        td({className: "payload"}, payload),
        td({className: "opcode"}, getOpCodeLabel(frame)),
        td({className: "bit"}, data.maskBit ? "true" : "false"),
        td({className: "bit"}, data.finBit ? "true" : "false"),
        td({className: "time"}, timeText)
      )
    );
  }
}));

/**
 * Template for WS events (connect and disconnect) displayed in the
 * frame list (table view)
 */
var EventRow = React.createFactory(React.createClass({
/** @lends FrameRow */

  displayName: "EventRow",

  /**
   * Frames need to be re-rendered only if the selection changes.
   * This is an optimization that makes the list rendering a lot faster.
   */
  shouldComponentUpdate: function(nextProps, nextState) {
    return this.props.frame == nextProps.selection ||
      this.props.frame == this.props.selection;
  },

  onClick: function() {
    if (this.props.frame != this.props.selection) {
      this.props.dispatch(selectFrame(this.props.frame));
    }
  },

  render: function() {
    var frame = this.props.frame;
    var className = "frameRow eventRow";

    if (this.props.selection == frame) {
      className += " selected";
    }

    var label = frame.uri ?
      Locale.$STR("websocketmonitor.event.connected") :
      Locale.$STR("websocketmonitor.event.disconnected");

    var uri = frame.uri ? frame.uri :
      Locale.$STR("websocketmonitor.event.code") + " " + frame.code;

    return (
      tr({className: className, onClick: this.onClick},
        td({className: "direction"}),
        td({className: "socketId"},
          frame.webSocketSerialID
        ),
        td({className: "", colSpan: 6},
          span({className: "text"}, label),
          span({className: "uri"}, uri)
        )
      )
    );
  }
}));

/**
 * Used to display a warning if "@mozilla.org/websocketevent/service;1"
 * needed by this extension isn't available on the platform.
 */
var WarningRow = React.createFactory(React.createClass({
/** @lends WarningRow */

  displayName: "WarningRow",

  render: function() {
    return (
      tr({},
        td({colSpan: 8},
          NoServiceWarning({})
        )
      )
    );
  }
}));

// Exports from this module
exports.FrameTable = FrameTable;
});
