C:\Users\Excel\Desktop\Python>swift product_cycle.swift
<module-includes>:1:10: note: in file included from <module-includes>:1:
 1 | #include "AssertionReporting.h"
   |          `- note: in file included from <module-includes>:1:
 2 | #include "CoreFoundationShims.h"
 3 | #include "EmbeddedShims.h"

C:\Users\Excel\AppData\Local\Programs\Swift\Platforms\6.0.2\Windows.platform\Developer\SDKs\Windows.sdk\usr\lib\swift\shims/AssertionReporting.h:16:10: note: in file included from C:\Users\Excel\AppData\Local\Programs\Swift\Platforms\6.0.2\Windows.platform\Developer\SDKs\Windows.sdk\usr\lib\swift\shims/AssertionReporting.h:16:
14 | #define SWIFT_STDLIB_SHIMS_ASSERTIONREPORTING_H_
15 |
16 | #include "SwiftStdint.h"
   |          `- note: in file included from C:\Users\Excel\AppData\Local\Programs\Swift\Platforms\6.0.2\Windows.platform\Developer\SDKs\Windows.sdk\usr\lib\swift\shims/AssertionReporting.h:16:
17 | #include "Visibility.h"
18 |

<unknown>:0: error: could not build C module 'SwiftShims'
C:\Users\Excel\AppData\Local\Programs\Swift\Platforms\6.0.2\Windows.platform\Developer\SDKs\Windows.sdk\usr\lib\swift\shims/SwiftStdint.h:28:10: error: 'stdint.h' file not found 
26 | // __UINTxx_TYPE__ are defined only since Clang 3.5.
27 | #if !defined(__APPLE__) && !defined(__linux__) && !defined(__OpenBSD__) && !defined(__wasi__)
28 | #include <stdint.h>
   |          `- error: 'stdint.h' file not found
29 | typedef int64_t __swift_int64_t;
30 | typedef uint64_t __swift_uint64_t;
