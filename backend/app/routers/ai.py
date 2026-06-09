from fastapi import APIRouter, Depends
from app.schemas.ai import OutlineReq, GenerateReq, BeautifyReq, OutlineRes, GenerateRes

router = APIRouter(prefix="/api/ai", tags=["ai"])

SAMPLE_XML = """<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>
<mxCell id="2" value="System Input" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="40" y="40" width="160" height="60" as="geometry"/></mxCell>
<mxCell id="3" value="Processing Module" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;" vertex="1" parent="1"><mxGeometry x="280" y="40" width="160" height="60" as="geometry"/></mxCell>
<mxCell id="4" value="System Output" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;" vertex="1" parent="1"><mxGeometry x="520" y="40" width="160" height="60" as="geometry"/></mxCell>
<mxCell id="5" value="" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="2" target="3"><mxGeometry width="50" relative="1" as="geometry"><mxPoint x="200" y="70"/><mxPoint x="280" y="70"/></mxGeometry></mxCell>
<mxCell id="6" value="" style="endArrow=classic;html=1;rounded=0;" edge="1" parent="1" source="3" target="4"><mxGeometry width="50" relative="1" as="geometry"><mxPoint x="440" y="70"/><mxPoint x="520" y="70"/></mxGeometry></mxCell>
</root></mxGraphModel>"""


@router.post("/outline", response_model=OutlineRes)
async def generate_outline(req: OutlineReq):
    modules = [
        {"name": "Data Source", "description": f"Input layer for: {req.user_input}"},
        {"name": "Core Logic", "description": "Main processing and business logic"},
        {"name": "Output Layer", "description": "Result presentation and export"},
    ]
    return OutlineRes(
        title=f"Architecture: {req.user_input[:30]}",
        summary=f"A {req.style} architecture diagram with 3 modules.",
        modules=modules,
        relationships=["Data Source → Core Logic", "Core Logic → Output Layer"],
    )


@router.post("/generate-drawio", response_model=GenerateRes)
async def generate_drawio(req: GenerateReq):
    return GenerateRes(drawio_xml=SAMPLE_XML, summary="3-module architecture diagram.")


@router.post("/beautify", response_model=GenerateRes)
async def beautify(req: BeautifyReq):
    return GenerateRes(drawio_xml=SAMPLE_XML, summary="Diagram beautified.")
