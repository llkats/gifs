var fs = require('fs');
var path = require('path')
var glob = require('glob')
var yaml = require('write-yaml')

var site_index = '_includes/site-index.html'

glob('gifs/**/*.gif', function (err, files) {
  if (err) {
    throw err
  }

  lists = []
  gifs = []
  files.forEach(function (file) {
    stat = fs.statSync(file)
    gifs.push({
      'path': file,
      'modified_time': Math.floor(stat.mtime.getTime() / 1000),
      'extname': path.extname(file)
    })

    trimmed_path = file.replace('gifs/', '')
    header = trimmed_path.substring(0, trimmed_path.indexOf('/'));
    if (typeof lists[header] === 'undefined') {
      lists[header] = []
    }

    lists[header].push(
      '<li><a href="' + file + '" title="' + file + '" class="gif">' + file + '</a></li>'
    )
  })

  html = []
  for (var group in lists) {
    html.push('<li>' + group + '<ul>' + lists[group].join('') + '</ul></li>');
  }

  fs.writeFileSync('_includes/site-index.html', '<ul>' + html.join('') + '</ul>')
  yaml.sync('_data/static_files.yml', gifs);
})
