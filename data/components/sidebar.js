/* See license.txt for terms of usage */

define(function(require, exports/*, module*/) {

"use strict";

// ReactJS
const React = require("react");

// Firebug.SDK
const { createFactories } = require("reps/rep-utils");
const { Tabs, TabPanel } = createFactories(require("reps/tabs"));

// WebSockets Monitor
const { DetailsTab } = createFactories(require("./details-tab"));
const { StackTab } = createFactories(require("./stack-tab"));
const { PayloadTab } = createFactories(require("./payload-tab"));
const { SocketIOTab } = createFactories(require("./socketio-tab"));

/**
 * @template This template represents a list of packets displayed
 * inside the panel content.
 */
var Sidebar = React.createClass({
/** @lends Sidebar */

  displayName: "Sidebar",

  getInitialState: function() {
    return {
      tabActive: 1,
   };
  },

  onTabChanged: function(index) {
    this.setState({tabActive: index});
  },

  render: function() {
    var tabActive = this.state.tabActive;
    var selectedFrame = this.props.selection || {};

    var tabs = [
      TabPanel({className: "details", title: Locale.$STR("websocketmonitor.Details")},
        DetailsTab(this.props)
      ),
      TabPanel({className: "payload", title: Locale.$STR("websocketmonitor.Payload")},
        PayloadTab(this.props)
      )
    ];

    if (selectedFrame && selectedFrame.socketIo) {
      tabs.push(
        TabPanel({className: "socketio", title: Locale.$STR("websocketmonitor.SocketIO")},
          SocketIOTab(this.props)
      ));
    }

    tabActive = Math.min(tabActive, tabs.length);

    /*TabPanel({className: "stack", title: "Stack"},
      StackTab(this.props)*/

    return (
      Tabs({tabActive: tabActive, onAfterChange: this.onTabChanged}, tabs)
    );
  }
});

// Exports from this module
exports.Sidebar = Sidebar;
});