import { Injectable } from "@angular/core";
import { Alignment, Borders, Fill, Workbook } from "exceljs";
import * as FileSaver from "file-saver";

export interface ExcelStyleConfig {
  header?: {
    font?: {
      bold?: boolean;
      color?: { argb: string };
      size?: number;
      name?: string;
    };
    fill?: {
      type?: "pattern";
      pattern?: "solid";
      fgColor?: { argb: string };
    };
    border?: {
      top?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
      bottom?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
      left?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
      right?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
    };
    alignment?: {
      vertical?: "middle" | "top" | "bottom";
      horizontal?: "center" | "left" | "right";
    };
  };
  data?: {
    font?: {
      size?: number;
      name?: string;
    };
    border?: {
      top?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
      bottom?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
      left?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
      right?: { style: "thin" | "medium" | "thick"; color: { argb: string } };
    };
    alignment?: {
      vertical?: "middle" | "top" | "bottom";
      horizontal?: "center" | "left" | "right";
    };
  };
}

@Injectable({
  providedIn: "root",
})
export class ExcelExportService {
  #defaultStyle: ExcelStyleConfig = {
    header: {
      font: { bold: true, color: { argb: "FFFFFF" }, size: 12, name: "Arial" },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
      alignment: { vertical: "middle", horizontal: "center" },
    },
    data: {
      font: { size: 11, name: "Arial" },
      border: {
        top: { style: "thin", color: { argb: "000000" } },
        bottom: { style: "thin", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: "000000" } },
        right: { style: "thin", color: { argb: "000000" } },
      },
      alignment: { vertical: "middle", horizontal: "center" },
    },
  };

  async exportToExcel(
    data: any[],
    fileName: string,
    headers: { title: string; name: string }[],
    styleConfig?: ExcelStyleConfig,
  ): Promise<void> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");
    const styles = { ...this.#defaultStyle, ...styleConfig };

    const headerTitles = headers.map(h => h.title);
    const headerNames = headers.map(h => h.name);

    const headerRow = worksheet.addRow(headerTitles);
    this.applyHeaderStyle(headerRow, styles.header);

    data.forEach(rowData => {
      const rowValues = headerNames.map(name => rowData[name] ?? "");
      const row = worksheet.addRow(rowValues);
      this.applyDataStyle(row, styles.data);
    });

    headers.forEach((header, columnIndex) => {
      const col = worksheet.getColumn(columnIndex + 1);
      let maxWidth = header.title.length;

      data.forEach(rowData => {
        const cellValue = rowData[header.name]?.toString() || "";
        const cellLength = cellValue.length;
        maxWidth = Math.max(maxWidth, cellLength);
      });

      col.width = maxWidth + 20;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcelFile(buffer, fileName);
  }

  private applyHeaderStyle(row: any, style: ExcelStyleConfig["header"]): void {
    row.eachCell(
      (cell: {
        font: { bold?: boolean; color?: { argb: string }; size?: number; name?: string };
        fill: Fill;
        border: Borders;
        alignment: Alignment;
      }) => {
        if (style?.font) cell.font = style.font;
        if (style?.fill) cell.fill = style.fill as Fill;
        if (style?.border) cell.border = style.border as Borders;
        if (style?.alignment) cell.alignment = style.alignment as Alignment;
      },
    );
  }

  private applyDataStyle(row: any, style: ExcelStyleConfig["data"]): void {
    row.eachCell((cell: { font: { size?: number; name?: string }; border: Borders }) => {
      if (style?.font) cell.font = style.font;
      if (style?.border) cell.border = style.border as Borders;
    });
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const timestamp = new Date().toISOString().split("T")[0];
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_${timestamp}${EXCEL_EXTENSION}`);
  }
}
