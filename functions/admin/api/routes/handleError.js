module.exports = (req, res) => res
  .status(404)
  .json({
    success: false,
    data: 'Endpoint not found',
  })
