/**
 * Created by shawnsandy on 8/13/14.
 */
var requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders
requireDir('./tasks', { recurse: true });