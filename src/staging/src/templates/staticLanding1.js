import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Seo from "../components/seo"
import Header from "../components/header"
import Footer from "../components/footer"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"
import { CssBaseline } from "@material-ui/core"
import "../styles/global.scss"
import "../styles/staticLanding1.scss"

const LandingPage = ({ pageContext }) => {
  const queryData = useStaticQuery(graphql`
    {
      strapiWebsites(Name: { eq: "BCParks.ca" }) {
        Footer
        Header
        Name
        Navigation
        id
        homepage {
          id
          Template
          Content {
            id
            strapi_component
            HTML
          }
        }
      }
      allStrapiMenus(
        sort: { fields: order, order: ASC }
        filter: { show: { eq: true } }
      ) {
        nodes {
          strapiId
          title
          url
          order
          id
          strapiChildren {
            id
            title
            url
            order
            parent
          }
          strapiParent {
            id
            title
          }
        }
      }
    }
  `)
  const menuContent = queryData?.allStrapiMenus?.nodes || []
  const { page } = pageContext
  const components = page?.Content || []
  const meta =
    components.find(component => component.strapi_component === "parks.seo") ||
    {}
  const introContent = components.slice(0, 1)
  const linkContent = components.slice(1)

  return (
    <>
      <Seo
        title={meta.metaTitle}
        description={meta.description}
        keywords={meta.metaKeywords}
      />
      <CssBaseline />
      <Header mode="internal" content={menuContent} />
      {linkContent.length > 0 && (
        <div id="intro-content" className="bcp-landing-intro">
          {introContent.map(content => (
            <PageContent
              key={content.id}
              contentType={content.strapi_component}
              content={content}
            />
          ))}
        </div>
      )}
      {linkContent.length > 0 && (
        <div id="link-content" className="bcp-landing-links">
          <div className="container">
            {linkContent.map(content => (
              <div key={content.id} className="row">
                <div className="col">
                  <PageContent
                    contentType={content.strapi_component}
                    content={content}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bcp-landing-park-search d-none d-lg-block">
        <div className="container">
          <div className="row">
            <div className="col">
              <StaticImage
                src="../images/landing/footer-find-your-next-adventure.png"
                alt="Two hikers filming in a BC Park"
              />
            </div>
            <div className="col">
              <MainSearch />
            </div>
          </div>
        </div>
      </div>
      <Footer>{queryData.strapiWebsites.Footer}</Footer>
    </>
  )
}

export default LandingPage
