import React from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { Layout, Menu, Breadcrumb, Button, Avatar, Dropdown } from 'antd'
import { LogoutOutlined, ProfileOutlined, PoweroffOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { compose } from 'redux'

import publicRoutes from '../router/routes/public'
import authorRoutes from '../router/routes/author'

import Can from '../rbac/Can'
import { logout } from '../store/actions'
import MenuStudent from '../component/menus/MenuStudent'
import MenuAuthor from '../component/menus/MenuAuthor'
import MenuSupervisor from '../component/menus/MenuSupervisor'
import MenuCourseManager from '../component/menus/MenuCourseManager'

const { Header, Content, Sider, Footer } = Layout

const DefaultLayout = ({ breadcrumbs, isLoggedIn, user, children, dispatch }) => {
  const exit = () => {
    dispatch(logout())
  }

  const ProfileMenu = (
    <Menu>
      <Menu.Item key="1" icon={<ProfileOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="2" icon={<LogoutOutlined />} onClick={exit}>
        Logout
      </Menu.Item>
    </Menu>
  )

  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }

  return (
    <Layout className="default-layout">
      <Header className="app-header">
        <div className="app-header__logo">
          <Link to="/">X Check App</Link>
        </div>
        <div className="app-header__controls">
          <>
            <Dropdown overlay={ProfileMenu}>
              <Button
                type="dashed"
                size="large"
                icon={
                  <Avatar
                    style={{
                      width: 24,
                      height: 24,
                      lineHeight: '24px',
                      fontSize: 18,
                      marginTop: -4,
                      marginRight: 10,
                    }}
                    size="small"
                    src={user.avatar_url}
                  />
                }
              >
                My Profile
              </Button>
            </Dropdown>
            <Button
              style={{ marginLeft: 10 }}
              type="danger"
              size="large"
              icon={<PoweroffOutlined />}
              onClick={exit}
            />
          </>
        </div>
      </Header>

      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb className="default-layout__breadcrumbs">
          {breadcrumbs.map(({ match, breadcrumb }) => (
            <Breadcrumb.Item key={match.url}>
              <Link to={match.url}>{breadcrumb}</Link>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
        <Layout style={{ padding: '24px 0', backgroundColor: '#fff' }}>
          <Sider width={320}>
            <Can role={user.role} perform="menu:student" yes={() => <MenuStudent />} />
            <Can role={user.role} perform="menu:author" yes={() => <MenuAuthor />} />
            <Can role={user.role} perform="menu:supervisor" yes={() => <MenuSupervisor />} />
            <Can role={user.role} perform="menu:course_manager" yes={() => <MenuCourseManager />} />
          </Sider>
          <Content className="default-layout__content">{children}</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
  )
}

DefaultLayout.defaultProps = {
  user: null,
}

DefaultLayout.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.oneOfType([PropTypes.object]),
  children: PropTypes.instanceOf(Object).isRequired,
  dispatch: PropTypes.func.isRequired,
  breadcrumbs: PropTypes.instanceOf(Object).isRequired,
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user,
  }
}

export default compose(
  withBreadcrumbs(
    [
      // order matters
      ...authorRoutes,
      ...publicRoutes,
      // ...spread other routes
    ],
    { disableDefaults: true },
  ),
  connect(mapStateToProps, null),
)(DefaultLayout)
