import { copycat } from '@snaplet/copycat'

import { NewPrismaClient } from '../_utils/types'
import testMatrix from './_matrix'
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore this is just for type checks
import type { PrismaClient } from './node_modules/@prisma/client'

declare let prisma: PrismaClient<{ log: [{ emit: 'event'; level: 'query' }] }>
declare let newPrismaClient: NewPrismaClient<typeof PrismaClient>

testMatrix.setupTestSuite(() => {
  beforeAll(async () => {
    prisma = newPrismaClient({
      log: ['query'],
    })

    await prisma.user.create({
      data: {
        firstName: copycat.firstName(1),
        lastName: copycat.lastName(2),
      },
    })

    // create duplicate for the test
    await prisma.user.create({
      data: {
        firstName: copycat.firstName(1),
        lastName: copycat.lastName(2),
      },
    })

    // create half duplicate for the test
    await prisma.user.create({
      data: {
        firstName: copycat.firstName(1),
        lastName: copycat.lastName(3),
      },
    })

    await prisma.user.create({
      data: {
        firstName: copycat.firstName(2),
        lastName: copycat.lastName(4),
      },
    })
  })

  test('distinct on firstName', async () => {
    const result = await prisma.user.findMany({
      distinct: ['firstName'],
    })

    expect(result.length).toBe(2)
  })

  test('distinct on firstName and lastName', async () => {
    const result = await prisma.user.findMany({
      distinct: ['firstName', 'lastName'],
    })

    expect(result.length).toBe(3)
  })

  test('distinct on id', async () => {
    const result = await prisma.user.findMany({
      distinct: ['id'],
    })

    expect(result.length).toBe(4)
  })

  test('distinct on id and firstName', async () => {
    const result = await prisma.user.findMany({
      distinct: ['id', 'firstName'],
    })

    expect(result.length).toBe(4)
  })

  test('distinct on id and lastName', async () => {
    const result = await prisma.user.findMany({
      distinct: ['id', 'lastName'],
    })

    expect(result.length).toBe(4)
  })

  test('distinct on firstName and id', async () => {
    const result = await prisma.user.findMany({
      distinct: ['firstName', 'id'],
    })

    expect(result.length).toBe(4)
  })

  test('distinct on firstName and firstName', async () => {
    const result = await prisma.user.findMany({
      distinct: ['firstName', 'firstName'],
    })

    expect(result.length).toBe(2)
  })

  test('distinct on id and firstName and lastName', async () => {
    const result = await prisma.user.findMany({
      distinct: ['id', 'firstName', 'lastName'],
    })

    expect(result.length).toBe(4)
  })

  test('distinct on id shortcut', async () => {
    const result = await prisma.user.findMany({
      distinct: 'id',
    })

    expect(result.length).toBe(4)
  })

  test('distinct on id and firstName shortcut', async () => {
    const result = await prisma.user.findMany({
      distinct: 'firstName',
    })

    expect(result.length).toBe(2)
  })
})
