var createError = require('http-errors')
var session = require('express-session')
var flash = require('express-flash')
var express = require('express')
var logger = require('morgan')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var db = require('./database')
var app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: '123@123abc',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  }),
)
app.use(flash())

// Rota para listar os dados
app.get('/', function (req, res, next) {
  var sql = 'SELECT * FROM tbl_livro'
  db.query(sql, function (err, result) {
    if (err) throw err
    res.render('index', { title: 'Lista de Livros', livros: result })
  })
});

// Rota para excluir um dado
app.post('/deletar/:id', function (req, res, next) {
  var idLivro = req.params.id;
  var sql = 'DELETE FROM tbl_livro WHERE ID_Livro = ?';
  db.query(sql, [idLivro], function (err, result) {
    if (err) throw err;
    console.log('Registro excluído');
    req.flash('success', 'Dado excluído!');
    res.redirect('/');
  });
});

// Rota para adicionar um dado
//app.get('/', function (req, res, next) {
//  res.render('index', { title: 'User Form' })
//})
app.post('/user_form', function (req, res, next) {
  var Nome_Livro = req.body.Nome_Livro
  var ISBN13 = req.body.ISBN13
  var ISBN10 = req.body.ISBN10
  var ID_Categoria = req.body.ID_Categoria
  var ID_Autor = req.body.ID_Autor
  var ID_Editora = req.body.ID_Editora
  var Data_Pub = req.body.Data_Pub
  var Preco_Livro = req.body.Preco_Livro
  var sql = `INSERT INTO tbl_livro (Nome_Livro, ISBN13, ISBN10, ID_Categoria, ID_Autor, ID_Editora, Data_Pub, Preco_Livro) VALUES
   ("${Nome_Livro}", "${ISBN13}", "${ISBN10}", "${ID_Categoria}", "${ID_Autor}", "${ID_Editora}", "${Data_Pub}", "${Preco_Livro}")`
  db.query(sql, function (err, result) {
    if (err) throw err
    console.log('Registro atualizado')
    req.flash('success', 'Dado armazenado!')
    res.redirect('/')
  })
})

// Rota de erro 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Tratamento de erros
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Iniciar servidor
app.listen(5555, function () {
  console.log('Servidor está rodando na porta : 5555');
});

module.exports = app