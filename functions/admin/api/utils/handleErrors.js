const error404 = (req, res) => res
  .status(404)
  .json({
    success: false,
    data: 'Endpoint not found',
  })

const error500 = (res, err) => {
  return res.status(500).send({ message: `${err.code} - ${err.message}` })
}

module.exports = {
  error404,
  error500,
}