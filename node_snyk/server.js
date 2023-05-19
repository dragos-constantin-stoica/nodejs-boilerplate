// CommonJs
const fastify = require('fastify')({
  logger: true
})

const PORT = 8080
const HOST = '0.0.0.0'

async function closeGracefully(signal) {
   console.log(`*^!@4=> Received signal to terminate: ${signal}`)

   await fastify.close()
   // await db.close() if we have a db connection in this app
   // await other things we should cleanup nicely
   process.kill(process.pid, signal);
}
process.once('SIGINT', closeGracefully)
process.once('SIGTERM', closeGracefully)
process.once('SIGHUP', closeGracefully)


fastify.register(require('fastify-healthcheck'), {
   healthcheckUrl: '/ok',
  // healthcheckUrlDisable: true,
  // healthcheckUrlAlwaysFail: true,
  // exposeUptime: true,
  // underPressureOptions: { } // no under-pressure specific options set here
  exposeUptime: true // enable, as a sample
})


fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})


fastify.get('/delayed', async (request, reply) => {
 const SECONDS_DELAY = 5000
 await new Promise(resolve => {
     setTimeout(() => resolve(), SECONDS_DELAY)
 })
 return { hello: 'delayed world' }
})

const start = async () => {
 try {
   await fastify.listen(PORT, HOST)
   console.log(`*^!@4=> Process id: ${process.pid}`)
 } catch (err) {
   fastify.log.error(err)
   process.exit(1)
 }
}

start()
