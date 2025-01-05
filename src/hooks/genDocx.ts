"use client";
import {
  AlignmentType,
  Document,
  Packer,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType
} from "docx";
import { saveAs } from "file-saver";

const genDocx = () => {
  const generateConsultation = async (data) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Table({
              borders: TableBorders.NONE,
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: "BỆNH VIỆN BẠCH MAI",
                              size: 26,
                              bold: true
                            })
                          ]
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                              size: 26,
                              bold: true
                            })
                          ]
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    })
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.LEFT,
                          children: [
                            new TextRun({
                              text: "KHOA.........................",
                              size: 26
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "Độc lập - Tự do - Hạnh phúc",
                              size: 26,
                              bold: true
                            })
                          ]
                        })
                      ],
                      verticalAlign: VerticalAlign.CENTER
                    })
                  ]
                })
              ]
            }),
            new Paragraph({}),
            new Paragraph({}),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "TRÍCH BIÊN BẢN HỘI CHẨN",
                  size: 30,
                  bold: true
                })
              ]
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Họ tên bệnh nhân: ............................................................. Tuổi ........... Nam/Nữ..........",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Đã điều trị từ ngày:......../........../ .........................Đến ngày......../........./ ........................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tại số giường:...............Phòng.............................Khoa...................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Chẩn đoán:........................................Hội chẩn lúc .....giờ.....phút, ngày….../....../..........",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Chủ tọa:................................................Thư ký:...............................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Thành viên tham gia:.......................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tóm tắt quá trình diễn biến bệnh, quá trình điều trị và chăm sóc người bệnh:",
                  size: 26,
                  bold: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Kết luận: (Sau khi đã khám lại và thảo luận)",
                  size: 26,
                  bold: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Hướng điều trị tiếp:",
                  size: 26,
                  bold: true
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: ".........................................................................................................................................",
                  size: 26
                })
              ]
            }),
            new Paragraph({}),
            new Paragraph({}),
            new Table({
              borders: TableBorders.NONE,
              width: {
                size: 100,
                type: WidthType.PERCENTAGE
              },
              rows: [
                new TableRow({
                  height: {
                    rule: "atLeast",
                    value: "0.53cm"
                  },
                  tableHeader: true,
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "",
                              size: 26
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE
                      }
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "................., Ngày...... tháng........ năm.........",
                              size: 26
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE
                      }
                    })
                  ]
                }),

                new TableRow({
                  height: {
                    rule: "atLeast",
                    value: "0.53cm"
                  },
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "Thư ký",
                              size: 26,
                              bold: true
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE
                      }
                    }),
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "Chủ tọa",
                              size: 26,
                              bold: true
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE
                      }
                    })
                  ]
                }),

                new TableRow({
                  height: {
                    rule: "atLeast",
                    value: "0.53cm"
                  },
                  children: [
                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "(Ký tên, ghi rõ họ tên)",
                              size: 26,
                              italics: true
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE
                      }
                    }),

                    new TableCell({
                      verticalAlign: VerticalAlign.CENTER,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: "(Ký tên, ghi rõ họ tên)",
                              size: 26,
                              italics: true
                            })
                          ]
                        })
                      ],
                      width: {
                        size: 50,
                        type: WidthType.PERCENTAGE
                      }
                    })
                  ]
                })
              ]
            })
          ]
        }
      ]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "TRÍCH_BIÊN_BẢN_HỘI_CHẨN.docx");
    });
  };

  return {
    generateConsultation
  };
};

export default genDocx;
