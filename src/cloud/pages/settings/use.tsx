import React, { useCallback, useState } from 'react'
import Page from '../../components/Page'
import styled from '../../lib/styled'
import { getSettingsUsePageData } from '../../api/pages/settings'
import ErrorBlock from '../../components/atoms/ErrorBlock'
import cc from 'classcat'
import { Spinner } from '../../components/atoms/Spinner'
import Button from '../../components/atoms/Button'
import Flexbox from '../../components/atoms/Flexbox'
import Icon from '../../components/atoms/Icon'
import { mdiCheckboxBlankCircleOutline, mdiCheckCircleOutline } from '@mdi/js'
import { createTeam } from '../../api/teams'
import { useNavigateToTeam } from '../../components/atoms/Link/TeamLink'
import { useRouter } from '../../lib/router'
import { GetInitialPropsParameters } from '../../interfaces/pages'

const SettingsUsePage = () => {
  const [sending, setSending] = useState<boolean>(false)
  const [error, setError] = useState<unknown>()
  const { push } = useRouter()
  const [type, setType] = useState<'personal' | 'team'>('personal')
  const navigateToTeam = useNavigateToTeam()

  const setAccount = useCallback(
    async (e: any) => {
      e.preventDefault()
      setSending(true)
      if (type === 'team') {
        push('/cooperate?welcome=true')
        return
      }
      try {
        const { team } = await createTeam({ personal: true })
        navigateToTeam(team, 'index', { onboarding: true })
        return
      } catch (error) {
        setError(error)
      }
      setSending(false)
    },
    [push, type, navigateToTeam]
  )

  return (
    <Page>
      <Container>
        <div className='settings__wrap'>
          <h1>How are you planning to use Boost Note?</h1>
          <p>We&apos;ll streamline your setup experience accordingly</p>

          <form onSubmit={setAccount}>
            <Flexbox justifyContent='space-between' className='row'>
              <div
                className={cc([
                  'account__type',
                  type === 'personal' && 'active',
                ])}
                onClick={() => setType('personal')}
              >
                <img src='/static/images/sozai1.svg' />
                <strong>Cloud space for myself</strong>
                <p>
                  Write fast, think deeply. Organize Your personal wiki with
                  powerful features.
                </p>
                <Icon
                  className='account__type__icon'
                  path={
                    type === 'personal'
                      ? mdiCheckCircleOutline
                      : mdiCheckboxBlankCircleOutline
                  }
                  size={30}
                />
              </div>
              <div
                className={cc(['account__type', type === 'team' && 'active'])}
                onClick={() => setType('team')}
              >
                <img src='/static/images/sozai2.svg' />
                <strong>Cloud space with my team</strong>
                <p>
                  Collaborate smoothly with real-time markdown co-authoring and
                  team optimized features.
                  <br />
                </p>
                <Icon
                  className='account__type__icon'
                  path={
                    type === 'team'
                      ? mdiCheckCircleOutline
                      : mdiCheckboxBlankCircleOutline
                  }
                  size={30}
                />
              </div>
            </Flexbox>
            {error != null && (
              <ErrorBlock error={error} style={{ marginBottom: 32 }} />
            )}
            <Flexbox justifyContent='center'>
              <Button type='submit' disabled={sending} variant='primary'>
                {sending ? (
                  <Spinner style={{ position: 'relative', top: 0, left: 0 }} />
                ) : (
                  'Get started for free'
                )}
              </Button>
            </Flexbox>
          </form>
        </div>
      </Container>
    </Page>
  )
}

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  .settings__wrap {
    position: relative;
    width: 1020px;
    max-width: 96%;
    margin: 0 auto;
    text-align: center;
  }
  .account__type__icon {
    position: absolute;
    right: 5px;
    top: 5px;
  }
  .account__type {
    &:not(.active) {
      .account__type__icon {
        color: ${({ theme }) => theme.baseIconColor};
      }
      opacity: 0.6;
    }
    &.active {
      .account__type__icon {
        color: ${({ theme }) => theme.primaryTextColor};
      }
      border-color: ${({ theme }) => theme.primaryBorderColor};
    }
    position: relative;
    cursor: pointer;
    border: 3px solid ${({ theme }) => theme.blackBackgroundColor};
    border-radius: 3px;
    min-height: 100%;
    width: 48%;
    text-align: center;
    margin: 0 ${({ theme }) => theme.space.small}px;
    padding: ${({ theme }) => theme.space.small}px
      ${({ theme }) => theme.space.medium}px;
    display: block;
    background-color: ${({ theme }) => theme.whiteBackgroundColor};
    color: ${({ theme }) => theme.blackBackgroundColor} !important;
    img {
      margin: ${({ theme }) => theme.space.small}px auto;
      display: block;
      width: 60%;
      height: 200px;
    }
    strong {
      display: block;
      font-size: ${({ theme }) => theme.fontSizes.large}px;
      margin-bottom: ${({ theme }) => theme.space.small}px;
    }
  }
  h1 {
    color: ${({ theme }) => theme.emphasizedTextColor};
    font-size: ${({ theme }) => theme.fontSizes.xl}px;
    margin-top: ${({ theme }) => theme.space.xxxlarge}px;
  }
  form {
    text-align: left;
    margin-top: ${({ theme }) => theme.space.xxlarge}px;
    .row {
      margin: ${({ theme }) => theme.space.xxlarge}px 0;
      position: relative;
    }
  }
`

SettingsUsePage.getInitialProps = async (params: GetInitialPropsParameters) => {
  const result = await getSettingsUsePageData(params)
  return result
}

export default SettingsUsePage