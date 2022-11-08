import React from 'react';
import {useNavigate} from "react-router-dom";
import {HOME} from "../misc/config";

function PageHeader() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="hcContentContainer bgColorBrand1 hcMarginBottom1">
                <header className=" hcPageHeaderSimple hcBasicSideMargin">
                    <div className="hcBrand">
                        <div className="hcBrandLogo" onClick={() => {navigate("/")}}>
                            <div className="hcTitle">CLARIAH+ FAIR Vocabulary Registry</div>
                        </div>
                    </div>

                    <nav>
                        <a href={HOME}>Test version</a>
                    </nav>
                </header>
            </div>
            <div className="hcContentContainer hcMarginBottom5 hcBorderBottom">

            </div>
        </div>
    )
}

export default PageHeader;