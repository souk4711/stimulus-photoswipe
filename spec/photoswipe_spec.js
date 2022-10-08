import { expect } from 'chai'
import { name } from '../dist'

describe('PhotoSwipe', () => {
  it('#name', () => {
    expect(name).to.eq('Stimulus PhotoSwipe')
  })
})
