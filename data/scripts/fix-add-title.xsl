<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:math="http://www.w3.org/2005/xpath-functions/math"
    xmlns:cmd="http://www.clarin.eu/cmd/"
    exclude-result-prefixes="xs math"
    version="3.0">
    
    <xsl:template match="node() | @*">
        <xsl:copy>
            <xsl:apply-templates select="node() | @*"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="cmd:Vocabulary" priority="10">
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:choose>
                <xsl:when test="normalize-space(cmd:title)=''">
                    <cmd:title xml:lang='en'>
                        <xsl:value-of select="replace(base-uri(),'^.*/[^-]*-([^@]+).*$','$1')"/>
                    </cmd:title>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:copy-of select="cmd:title"/>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:apply-templates select="node() except cmd:title"/>
        </xsl:copy>
    </xsl:template>
    
</xsl:stylesheet>