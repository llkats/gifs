const fs = require('fs');
const path = require('path')
const glob = require('glob')
const yaml = require('write-yaml')

const site_index = '_includes/site-index.html'

glob('gifs/**/*.gif', function (err, files) {
  if (err) {
    throw err
  }

  let lists = []
  let gifs = []
  files.forEach(function (file) {
    const stat = fs.statSync(file)
    gifs.push({
      'path': file,
      'modified_time': Math.floor(stat.mtime.getTime() / 1000),
      'extname': path.extname(file)
    })

    const trimmed_path = file.replace('gifs/', '')
    const header = trimmed_path.substring(0, trimmed_path.indexOf('/')).replace('-', ' ');
    if (typeof lists[header] === 'undefined') {
      lists[header] = []
    }

    lists[header].push(
      '<li><a href="' + file + '" title="' + file + '" class="gif">' + path.basename(file, path.extname(file)) + '</a></li>'
    )
  })

  let html = []
  for (let group in lists) {
    html.push('<li>' + group + '<ul>' + lists[group].join('') + '</ul></li>');
  }

  fs.writeFileSync('_includes/site-index.html', '<ul>' + html.join('') + '</ul>')
  yaml.sync('_data/static_files.yml', gifs);
})
