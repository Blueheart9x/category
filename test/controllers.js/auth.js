import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../src/server'
import { ResponseCode } from '../../src/common/constants/response'
const should = chai.should()

chai.use(chaiHttp)

describe('Authenticate success', () => {
    it('Send correct password', (done) => {
        const userCredentials = {
            "username": "diendn",
            "password": "123456"
        }

        chai.request(server)
            .post('/api/authenticate')
            .send(userCredentials)
            .end((error, res) => {
                res.should.have.status(ResponseCode.OK)
                res.body.should.be.a('object')
                done()
            })
    })
})

describe('Authenticate false', () => {
    it('Send wrong password', (done) => {
        const userCredentials = {
            "username": "diendn",
            "password": "1234567"
        }

        chai.request(server)
            .post('/api/authenticate')
            .send(userCredentials)
            .end((error, res) => {
                res.should.have.status(ResponseCode.UNAUTHORIZED)
                res.body.should.be.a('object')
                done()
            })
    })
})