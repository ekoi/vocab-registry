import React from 'react';
import {useNavigate} from "react-router-dom";

function PageHeader() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="hcContentContainer bgColorBrand1 hcMarginBottom1">
                <header className=" hcPageHeaderSimple hcBasicSideMargin">
                    <div className="hcBrand">
                        <div className="hcBrandLogo" onClick={() => {navigate("/")}}>
                            <div className="hcTitle">Diplomatieke Getuigenissen</div>
                        </div>
                    </div>

                    <nav>
                        <a href="">Test version</a>
                    </nav>
                </header>
            </div>
            <div className="hcContentContainer hcMarginBottom5 hcBorderBottom">

            </div>
        </div>
    )
}

export default PageHeader;