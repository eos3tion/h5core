namespace jy {




    /**
     * WebGL的常量值  
     * 
     * https://github.com/whh8162880/RFStage3D/blob/develop/src/com/youbt/core/Capabilities.ts
     * 
     * http://webglreport.com/
     */
    export interface WebGLCapabilities {

        /** 
         * gl 的版本，如：  
         * WebGL 1.0 (OpenGL ES 2.0 Chromium)
         */
        readonly version: string;
        /** 
         * GLSL 语言版本，如：  
         * WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium) 
         * 
         */
        readonly shaderVersion: string;
        /**
         * 供应商：
         * webkit
         */
        readonly vendor: string;
        /** 
         * 渲染器：
         * WebKit WebGL
         */
        readonly renderer: string;
        /** 
         * 供应商，如： 
         * Google Inc  
         * Intel Inc.
         */
        readonly unmaskedVendor?: string;
        /** 
         * 渲染器： 
         * ANGLE (AMD Radeon HD 7700 Series Direct3D11 vs_5_0 ps_5_0)  
         * Intel Iris OpenGL Engine
         * 可以拿到显卡信息
         */
        readonly unmaskedRenderer?: string;
        /** 
         * 是否抗支持锯齿  
         */
        readonly antialias: boolean;
        /** 
         * 是否使用了 ANGLE 技术来使 Direct X 支持 WebGL 的接口, 文档地址: https://baike.baidu.com/item/angle/3988?fr=aladdin 
         * 
         * Google宣布了新的开源项目 ANGLE （全称 Almost Native Graphics Layer Engine），这个项目的目标是在 Direct X 9.0c API 的基础上实现一层 OpenGL ES 2.0 API中 的 Web GL 子集接口。在开发的早期，ANGLE 项目将使用 BSD 授权发布，而最终完成后，类似 Google Chrome 之类的浏览器在 Windows 平台上运行 WebGL 内容将不再依赖于任何的 OpenGL 驱动程序。 [1] 
        */

        readonly angle: AngleVersion;

        // ----- Shader Begin -----
        /** 
         * 顶点着色器中最多可以定义的属性数量 
         */
        readonly maxVertAttr: number;
        /** 
         * 一个顶点着色器上可以使用纹理单元的最大数量 
         */
        readonly maxVertTextureCount: number;
        /** 
         * 一个顶点着色器上可以使用的 uniform 向量的最大数量 
         */
        readonly maxVertUniforms: number;
        /** 
         * 一个着色器上可以使用的 varying 向量的最大数量
         */
        readonly maxVaryings: number;
        /**
         *  一个片段着色器上可以使用的 uniform 向量的最大数量
         */
        readonly maxFragUniform: number;
        // ----- Shader  End  -----




        // ----- Rasterizer Begin -----
        /** 
         * 带锯齿直线宽度的范围  
         */
        readonly aliasedLineWidth: Float32Array[];
        /** 
         * 带锯齿点的尺寸范围 
         */
        readonly aliasedPointSize: Float32Array[];
        // ----- Rasterizer  End  -----


        // ----- Textures Begin -----
        /** 
         * 一个片段着色器上可以使用纹理单元的最大数量 
         */
        readonly maxTextureCount: number;
        /** 
         * 纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸
         */
        readonly maxTextureSize: number;
        /** 
         * 立方图纹理图片最大支持的尺寸, 高宽均必须小于等于该尺寸
         */
        readonly maxCubeMapTextureSize: number;
        /** 
         * 所有片段着色器总共能访问的纹理单元数
         */
        readonly maxCombinedTextureCount: number;
        /** 
         * 最大同向异性过滤值, 文档: https://blog.csdn.net/dcrmg/article/details/53470174 
         */
        readonly maxAnisotropy: number;
        // ----- Textures  End  -----

        // ----- Framebuffer Begin -----

        readonly maxDrawBuffers: number;
        /** 
         * 颜色缓存中红色的位数 
         */
        readonly redBits: number;
        /** 
         * 颜色缓存中绿色的位数
         */
        readonly greenBits: number;
        /** 颜色缓存中蓝色的位数 */
        readonly blueBits: number;
        /** 颜色缓存中透明度的位数 */
        readonly alphaBits: number;
        /** 深度缓存中每个像素的位数 */
        readonly depthBits: number;
        /** 模板缓存中每个像素的位数 */
        readonly stencilBits: number;
        /** 最大的渲染缓冲尺寸 */
        readonly maxRenderBufferSize: number;
        /** 视口最大尺寸 */
        readonly maxViewportSize: Int32Array[];
        // ----- Framebuffer  End  -----
    }

    /**
     * ANGLE （全称 Almost Native Graphics Layer Engine），这个项目的目标是在 Direct X 9.0c API 的基础上实现一层 OpenGL ES 2.0 API中 的 Web GL 子集接口。
     */
    export const enum AngleVersion {
        No,
        D3D9,
        D3D11
    }

    function isPowerOfTwo(n: number) {
        return (n !== 0) && ((n & (n - 1)) === 0);
    }



    function getAngle(getParameter: { (pname: number): any }) {
        const [min, max] = getParameter(WebGLConst.ALIASED_LINE_WIDTH_RANGE);

        // Heuristic: ANGLE is only on Windows, not in IE, and not in Edge, and does not implement line width greater than one.
        const angle = ((navigator.platform === 'Win32') || (navigator.platform === 'Win64')) &&
            (getParameter(WebGLConst.RENDERER) !== 'Internet Explorer') &&
            (getParameter(WebGLConst.RENDERER) !== 'Microsoft Edge') &&
            (min === 0 && max === 1);

        if (angle) {
            // Heuristic: D3D11 backend does not appear to reserve uniforms like the D3D9 backend, e.g.,
            // D3D11 may have 1024 uniforms per stage, but D3D9 has 254 and 221.
            //
            // We could also test for WEBGL_draw_buffers, but many systems do not have it yet
            // due to driver bugs, etc.
            if (isPowerOfTwo(getParameter(WebGLConst.MAX_VERTEX_UNIFORM_VECTORS)) && isPowerOfTwo(getParameter(WebGLConst.MAX_FRAGMENT_UNIFORM_VECTORS))) {
                return AngleVersion.D3D11;
            } else {
                return AngleVersion.D3D9;
            }
        }

        return AngleVersion.No;
    }
    function getMaxAnisotropy(g: WebGLRenderingContext) {
        let e = g.getExtension('EXT_texture_filter_anisotropic')
            || g.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
            || g.getExtension('MOZ_EXT_texture_filter_anisotropic');
        if (e) {
            let max = g.getParameter(WebGLConst.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
            if (max === 0) {
                max = 2;
            }
            return max;
        }
    }

    function getMaxDrawBuffers(g: WebGLRenderingContext): number {
        let maxDrawBuffers = 1;
        let ext = g.getExtension("WEBGL_draw_buffers");
        if (ext != null) {
            maxDrawBuffers = g.getParameter(WebGLConst.MAX_DRAW_BUFFERS_WEBGL);
        }
        return maxDrawBuffers;
    }

    export function getWebGLCaps(g?: WebGLRenderingContext): WebGLCapabilities {
        if (!g) {
            const canvas = document.createElement("canvas");
            const webglAttr: WebGLContextAttributes = {
                stencil: true,
                failIfMajorPerformanceCaveat: true
            };
            g = canvas.getContext("webgl", webglAttr) || canvas.getContext("experimental-webgl", webglAttr);
        }
        if (!g) {
            return;
        }

        const getParameter = g.getParameter.bind(g);

        let unmaskedRenderer: string, unmaskedVendor: string;
        let dbgRenderInfo = g.getExtension("WEBGL_debug_renderer_info");
        if (dbgRenderInfo) {
            unmaskedVendor = getParameter(WebGLConst.UNMASKED_VENDOR_WEBGL);
            unmaskedRenderer = getParameter(WebGLConst.UNMASKED_RENDERER_WEBGL);
        }

        return {
            unmaskedRenderer,
            unmaskedVendor,
            version: getParameter(WebGLConst.VERSION),
            shaderVersion: getParameter(WebGLConst.SHADING_LANGUAGE_VERSION),
            vendor: getParameter(WebGLConst.VENDOR),
            renderer: getParameter(WebGLConst.RENDERER),
            antialias: g.getContextAttributes().antialias,
            angle: getAngle(getParameter),
            maxVertAttr: getParameter(WebGLConst.MAX_VERTEX_ATTRIBS),
            maxVertTextureCount: getParameter(WebGLConst.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
            maxVertUniforms: getParameter(WebGLConst.MAX_VERTEX_UNIFORM_VECTORS),
            maxVaryings: getParameter(WebGLConst.MAX_VARYING_VECTORS),
            aliasedLineWidth: getParameter(WebGLConst.ALIASED_LINE_WIDTH_RANGE),
            aliasedPointSize: getParameter(WebGLConst.ALIASED_POINT_SIZE_RANGE),
            maxFragUniform: getParameter(WebGLConst.MAX_FRAGMENT_UNIFORM_VECTORS),
            maxTextureCount: getParameter(WebGLConst.MAX_TEXTURE_IMAGE_UNITS),
            maxTextureSize: getParameter(WebGLConst.MAX_TEXTURE_SIZE),
            maxCubeMapTextureSize: getParameter(WebGLConst.MAX_CUBE_MAP_TEXTURE_SIZE),
            maxCombinedTextureCount: getParameter(WebGLConst.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
            maxAnisotropy: getMaxAnisotropy(g),
            maxDrawBuffers: getMaxDrawBuffers(g),
            redBits: getParameter(WebGLConst.RED_BITS),
            greenBits: getParameter(WebGLConst.GREEN_BITS),
            blueBits: getParameter(WebGLConst.BLUE_BITS),
            alphaBits: getParameter(WebGLConst.ALPHA_BITS),
            depthBits: getParameter(WebGLConst.DEPTH_BITS),
            stencilBits: getParameter(WebGLConst.STENCIL_BITS),
            maxRenderBufferSize: getParameter(WebGLConst.MAX_RENDERBUFFER_SIZE),
            maxViewportSize: getParameter(WebGLConst.MAX_VIEWPORT_DIMS),
        }
    }
}